import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Arrays;

@SuppressWarnings("SameParameterValue")
class IndexBuilder {
    public static void main(String[] args) throws IOException {
        String indexPath = "C:\\Projects\\krabcode\\index.html";
        File html = new File(indexPath);
        Document doc = Jsoup.parse(html, "utf-8");
        Element container = doc.getElementById("autogenerated");
        container.text("");
        container.append(generateContentFromFolder("C:\\Projects\\krabcode\\content"));
        writeAllLines(Paths.get(indexPath), doc.outerHtml().split("/n"));
        println("index.html updated successfully");
        // TODO upload to forpsi
    }

    private static String generateContentFromFolder(String path) {
        StringBuilder result = new StringBuilder();
        File mainFolder = new File(path);
        File[] folders = mainFolder.listFiles();
        sortFoldersByTimeCreated(folders);

        for (File folder : folders) {
            if (folder.isDirectory()) {
                int uniqueFilenamesInFolder = uniqueFilenameCountInFolder(folder);
                if (uniqueFilenamesInFolder == 0) {
                    continue;
                }
                if (uniqueFilenamesInFolder == 1) {
                    result.append(createSimpleModal(folder));
                } else {
                    result.append(createCarouselModal(folder));
                }
                //TODO if folder contains .mp4 but not .webm generate one and add it to the html element too
                // FASTER LOADING is paramount!
            }
        }
        return result.toString();
    }

    private static void sortFoldersByTimeCreated(File[] folders) {
        assert folders != null;
        Arrays.sort(folders, (f1, f2) -> {
            try {
                return timeCreated(f2).compareTo(timeCreated(f1));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return 0;
        });
    }

    static FileTime timeCreated(File file) throws IOException {
        BasicFileAttributes attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
        return attrs.creationTime();
    }

    private static String createSimpleModal(File folder) {
        ArrayList<String> uniqueFilenames = uniqueFilenamesInFolder(folder);
        String videoExtension = getVideoExtension(folder);
        return "<a href=\"#" + folder.getName() + "Modal\" role=\"button\" data-toggle=\"modal\"> <img class=\"thumb\" src=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + ".jpg\" alt=\"" + folder.getName() + "\"/> </a>\n" +
                "    <div id=\"" + folder.getName() + "Modal\" class=\"modal fade\" role=\"dialog\">\n" +
                "        <div class=\"modal-dialog modal-dialog-centered modal-lg\">\n" +
                "            <div class=\"modal-content\">\n" +
                "                <div class=\"modal-body\">\n" +
                "                    <video autoplay controls loop muted poster=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + ".jpg\" class=\"embed-responsive embed-responsive-1by1 main-video\">\n" +
                "                        <source src=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + "." + videoExtension + "\" type=\"video/" + videoExtension + "\">\n" +
                "                    </video>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>";
    }

    @SuppressWarnings("StringConcatenationInsideStringBufferAppend")
    private static String createCarouselModal(File folder) {
        ArrayList<String> uniqueFilenames = uniqueFilenamesInFolder(folder);
        String videoExtension = getVideoExtension(folder);
        StringBuilder carouselModal = new StringBuilder();
        carouselModal.append("<a href=\"#" + folder.getName() + "Modal\" role=\"button\" data-toggle=\"modal\"> <img class=\"thumb\" src=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + ".jpg\" alt=\"" + folder.getName() + "\"/> </a>\n" +
                "    <div id=\"" + folder.getName() + "Modal\" class=\"modal fade\" role=\"dialog\">\n" +
                "        <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
                "            <div class=\"modal-content\">\n" +
                "                <div class=\"modal-body\">\n" +
                "                    <div id=\"" + folder.getName() + "Carousel\" class=\"carousel carousel-fade\" data-ride=\"carousel\" data-interval=\"false\" data-keyboard=\"false\">\n" +
                "                        <div class=\"carousel-inner\" role=\"listbox\">\n");

        carouselModal.append("<div class=\"carousel-item active\">\n" +
                "                  <video autoplay controls loop muted poster=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + ".jpg\" class=\"embed-responsive embed-responsive-1by1 main-video\">\n" +
                "                      <source src=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + "." + videoExtension + "\" type=\"video/" + videoExtension + "\">\n" +
                "                  </video>\n" +
                "              </div>\n");
        for (int i = 1; i < uniqueFilenames.size(); i++) {
            carouselModal.append("<div class=\"carousel-item\">\n" +
                    "      <video autoplay controls loop muted poster=\"content/" + folder.getName() + "/" + uniqueFilenames.get(0) + ".jpg\" class=\"embed-responsive embed-responsive-1by1 main-video\">\n" +
                    "          <source src=\"content/" + folder.getName() + "/" + uniqueFilenames.get(i) + "." + videoExtension + "\" type=\"video/" + videoExtension + "\">\n" +
                    "      </video>\n" +
                    "</div>\n");
        }

        carouselModal.append("</div>" +
                "     <a class=\"carousel-control-prev\" href=\"#" + folder.getName() + "Carousel\" role=\"button\" data-slide=\"prev\">\n" +
                "                            <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n" +
                "                            <span class=\"sr-only\">Previous</span>\n" +
                "                        </a>\n" +
                "                        <a class=\"carousel-control-next\" href=\"#" + folder.getName() + "Carousel\" role=\"button\" data-slide=\"next\">\n" +
                "                            <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n" +
                "                            <span class=\"sr-only\">Next</span>\n" +
                "                        </a>\n" +
                "\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>");
        return carouselModal.toString();
    }

    private static String getVideoExtension(File folder) {
        for (File f : folder.listFiles()) {
            if (f.getName().contains("mp4")) {
                return "mp4";
            }
            if (f.getName().contains("webm")) {
                return "webm";
            }
        }
        return null;
    }

    private static int uniqueFilenameCountInFolder(File folder) {
        return uniqueFilenamesInFolder(folder).size();
    }

    private static ArrayList<String> uniqueFilenamesInFolder(File folder) {
        ArrayList<String> knownFilenames = new ArrayList<String>();
        for (File f : folder.listFiles()) {
            String filenameWithoutExtension = f.getName().split("\\.")[0];
            if (!knownFilenames.contains(filenameWithoutExtension)) {
                knownFilenames.add(filenameWithoutExtension);
            }
        }
        return knownFilenames;
    }

    private static void writeAllLines(Path path, String[] gradleFile) throws IOException {
        FileWriter fw = new FileWriter(path.toFile());
        for (String s : gradleFile) {
            fw.write(s + System.lineSeparator());
        }
        fw.close();
    }

    static void println(String line) {
        System.out.println(line);
    }
}