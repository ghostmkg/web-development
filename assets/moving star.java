public class moving star
{

    public static void main(String[] args) throws InterruptedException {
        // Length of the console line
        int width = 50;

        // Infinite loop for continuous animation
        while (true) {
            // Loop to move the star from left to right
            for (int i = 0; i < width; i++) {
                printLine(i, width);
                Thread.sleep(100); // Pausing for a short duration to create animation effect
            }

            // Loop to move the star from right to left
            for (int i = width - 1; i >= 0; i--) {
                printLine(i, width);
                Thread.sleep(100);
            }
        }
    }

    // Method to print the star in the appropriate position
    public static void printLine(int position, int width) {
        // Clear the console screen (works in some consoles)
        System.out.print("\033[H\033[2J");
        System.out.flush();

        // Create the line with space and a single star
        for (int i = 0; i < width; i++) {
            if (i == position) {
                System.out.print("*");
            } else {
                System.out.print(" ");
            }
        }
        System.out.println();
    }
}
