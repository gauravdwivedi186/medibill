import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toWords } from 'number-to-words';
import Orders from '@/model/Orders';
import Customers from '@/model/Customers';
import Products from '@/model/Products';
import { parse } from "cookie"; import jwt from "jsonwebtoken";

const upload = multer({
    storage: multer.memoryStorage(),
});

export const config = {
    api: {
        bodyParser: true,
    },
};


const handler = async (req, res) => {
    if (req.method === 'GET') {
        const cookies = parse(req.headers.cookie || "");
        const token = cookies.admin_access_token;
        let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
        if (!decoded._id == process.env.ADMIN_PASSWORD) {
            return res
                .status(403)
                .json({ success: false, errors: "Unable to Authenticate" });
        }



        console.log(req.rawBody);
        console.log(req.body);
        const orderId = req.query.id;

        let ORDER = await Orders.findOne({ OrderID: orderId });
        if (!ORDER) {
            return res.status(400).json({ msg: "ORDER WAS NOT FOUND!" });
        }

        const customer = await Customers.findOne({ CustomerID: ORDER.CustomerID });

        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        const productIds = ORDER.Products.map(p => p.productId);

        const products = await Products.find({ ProductID: { $in: productIds } });
        if (!products.length) {
            return res.status(404).json({ msg: "Products not found" });
        }


        const mergedProducts = ORDER.Products.map(orderProduct => {
            const fullProduct = products.find(p => p.ProductID === orderProduct.productId);
            return {
                ...fullProduct.toObject(),
                quantity: orderProduct.quantity
            };
        });



        console.log("DETAILS");
        console.log(ORDER);
        console.log(customer);
        console.log(products);
        console.log(mergedProducts);


        const name = "UJJWAL K";
        const age = "30Yrs/";
        const gender = "Male";
        const slot_date = "2025-05-10";
        const book_date = "2025-05-01";
        const title = "Blood Test Basic...";
        const barcode = "BAR987654";
        const refer = "Dr. Smith";
        const cart = [{ item: "Blood Test", price: 500 }]; // Sample cart object
        const number = "9876543210";
        const total = 500;
        const subtotal = 550;
        const discount = 50;
        const wallet = 0;
        const refno = "REF001";
        const collection = "Home Visit";


        try {
            const InvoicePdfBytes = await fetch('https://medibill-eight.vercel.app/invoice_template.pdf').then(res => res.arrayBuffer());


            // INVOICE SIDE
            const invoicePdf = await PDFDocument.load(InvoicePdfBytes);
            const invoicePage = invoicePdf.getPage(0);
            const Invfont = await invoicePdf.embedFont(StandardFonts.Helvetica);
            const InvfontBold = await invoicePdf.embedFont(StandardFonts.HelveticaBold); // Load a bold font
            let serialNumber = 1; // Initialize serial number counter

            const randomId = Math.floor(1000000 + Math.random() * 9000000);

            // Draw patient details 
            invoicePage.drawText("ID: " + "ZB" + randomId, { x: 35, y: 760, size: 8, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(customer.CustomerName, { x: 100, y: 702, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(customer.CustomerEmail, { x: 94, y: 685, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(ORDER.Address.slice(0, 25), { x: 104, y: 665, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(customer.CustomerPhone, { x: 121, y: 651, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(orderId, { x: 415, y: 704, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(ORDER.TrackingID.join(', '), { x: 420, y: 685, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(ORDER.PaymentID.join(', '), { x: 425, y: 668, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(ORDER.Status, { x: 400, y: 650, size: 12, Invfont, color: rgb(0, 0, 0) });
            invoicePage.drawText(title.slice(0, 20) + '...', { x: 248, y: 591, size: 12, Invfont, color: rgb(0, 0, 0) });

            // Fetch test details
            const fetch_api = await fetch(`https://admin.samratpathlabs.com/api/tests?codes=${cart}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
 
            // Table variables
            const pageHeight = invoicePage.getHeight(); // Get page height
            let yPosition = 610; // Start position for the table 
            const rowHeight = 25;
            // Updated table variables
            const tableStartX = 65; // Adjusted starting position to include serial number column
            const columnWidths = [50, 60, 300, 60]; // Added width for serial number column


            // Function to create a new page and reset position
            function addNewPage() {
                const newPage = invoicePdf.addPage([invoicePage.getWidth(), pageHeight]);
                yPosition = 700; // Reset Y position for the new page
                drawTableHeaders(newPage);
                return newPage;
        }

            // Function to draw table headers on a page
            function drawTableHeaders(page) {
                page.drawRectangle({
                    x: tableStartX,
                    y: yPosition - rowHeight,
                    width: columnWidths.reduce((a, b) => a + b),
                    height: rowHeight,
                    color: rgb(0.7, 0.7, 0.7),
                    borderWidth: 1,
                    borderColor: rgb(0.5, 0.5, 0.5, 0.7),
                });

                page.drawText("S.No", { x: tableStartX + 5, y: yPosition - 15, size: 12, font: InvfontBold });
                page.drawText("ID", { x: tableStartX + columnWidths[0] + 5, y: yPosition - 15, size: 12, font: InvfontBold });
                page.drawText("Product Name", { x: tableStartX + columnWidths[0] + columnWidths[1] + 5, y: yPosition - 15, size: 12, font: InvfontBold });
                page.drawText("Price", { x: tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 5, y: yPosition - 15, size: 12, font: InvfontBold });
                yPosition -= rowHeight; // Move Y position below header
            }

            // Draw the initial table header
            drawTableHeaders(invoicePage);

            let currentPage = invoicePage; // Keep track of the current page


            mergedProducts.forEach((product) => {
                // Check if a new page is needed
                if (yPosition - rowHeight < 50) { // 50px bottom margin
                    currentPage = addNewPage();
                }

                // Draw the row background and borders
                currentPage.drawRectangle({
                    x: tableStartX,
                    y: yPosition - rowHeight,
                    width: columnWidths.reduce((a, b) => a + b),
                    height: rowHeight,
                    color: rgb(1, 1, 1), // White background
                    borderWidth: 1,
                    borderColor: rgb(0.5, 0.5, 0.5, 0.7),
                });


                function wrapText(text, maxWidth, font, size) {
                    const words = text.split(' '); // Split text into words
                    let lines = [];
                    let currentLine = words[0];

                    for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        const width = font.widthOfTextAtSize(`${currentLine} ${word}`, size);
                        if (width <= maxWidth) {
                            currentLine += ` ${word}`;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    lines.push(currentLine); // Push the last line
                    return lines;
                }

                // Draw the row text
                currentPage.drawText(`${serialNumber}.`, { x: tableStartX + 5, y: yPosition - 15, size: 10, font: Invfont });

                currentPage.drawText(product.ProductID, {
                    x: tableStartX + columnWidths[0] + 5,
                    y: yPosition - 15,
                    size: 10,
                    font: Invfont
                });

                const textLines = wrapText(product.ProductName, columnWidths[2] - 10, Invfont, 10);
                let textYPosition = yPosition - 15;

                textLines.forEach((line) => {
                    currentPage.drawText(line, {
                        x: tableStartX + columnWidths[0] + columnWidths[1] + 5,
                        y: textYPosition,
                        size: 10,
                        font: Invfont,
                    });
                    textYPosition -= 12;
                });


                currentPage.drawText(`${product.ProductPrice}`, {
                    x: tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 5,
                    y: yPosition - 15,
                    size: 10,
                    font: Invfont
                });


                // Move to the next row
                yPosition -= rowHeight;
                serialNumber++;
            });




            // After drawing the table, add the "Total Amount" text
            yPosition -= 20; // Add some spacing below the table


            // currentPage.drawText(`Sub Total: ${ORDER.Total}`, {
            //     x: tableStartX, // Align with the table start
            //     y: yPosition - 15, // Adjust the Y position
            //     size: 12, // Slightly larger font size
            //     font: Invfont, // Use the same font
            //     color: rgb(0, 0, 0), // Black color for text
            // });  

            currentPage.drawText(`Grand Total: ${ORDER.Total}.00/-`, {
                x: tableStartX, // Align with the table start
                y: yPosition - 79, // Adjust the Y position
                size: 13, // Slightly larger font size
                font: InvfontBold, // Use the same font
                color: rgb(0, 0, 0), // Black color for text
            });
            // Convert words to Camel Case
            function toCamelCase(words) {
                return words
                    .split(" ") // Split the sentence into words
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
                    .join(" "); // Join back into a string
            }

            // Get total in words and convert to Camel Case
            const totalInWords = toCamelCase(toWords(ORDER.Total)); // e.g., "Five Hundred Thirty-One"

            // Draw the Grand Total in words
            currentPage.drawText(`(${totalInWords} Rupees Only)`, {
                x: tableStartX,
                y: yPosition - 99, // Adjust Y position for the text below
                size: 12,
                font: Invfont,
                color: rgb(0, 0, 0),
            });


            currentPage.drawText(`**This is computer generated receipt and does not require any signature.`, {
                x: tableStartX, // Align with the table start
                y: yPosition - 115, // Adjust the Y position
                size: 9, // Slightly larger font size
                font: Invfont, // Use the same font
                color: rgb(0, 0, 0), // Black color for text
            });







            // const invoicePageByte = await PDFDocument.load(InvoicePdfBytes);
            // const invoicePage = invoicePageByte.getPage(0);

            // invoicePage.drawText(orderid, { x: 450, y: 747, size: 14, font, color: rgb(0, 0, 0) });
            // invoicePage.drawText(barcode, { x: 470, y: 767, size: 13, font, color: rgb(0, 0, 0) });
            // invoicePage.drawText(name, { x: 241, y: 653, size: 16, font, color: rgb(0, 0, 0) });
            // invoicePage.drawText(age, { x: 235, y: 625, size: 14, font, color: rgb(0, 0, 0) });
            // invoicePage.drawText(gender, { x: 276, y: 625, size: 14, font, color: rgb(0, 0, 0) });




            //   console.log("Merged PDF saved at:1");
            //   // Google Drive upload process
            //   const authClient = await authorize();
            //   console.log("Merged PDF saved at:");
            //   const fileId = await uploadToGoogleDrive(authClient, FinalInvoicePdfBytes, `${orderid + "_" + "_Invoice"}`);
            //   console.log("Merged PDF saved at:uploaded");
            //   await setFilePermissions(authClient, fileId);
            //   console.log("Merged PDF saved at:permisionto public");
            //   const InvoicefileUrl = await getFileUrl(authClient, fileId);
            //   console.log("Merged PDF drieve");

            const FinalInvoicePdfBytes = await invoicePdf.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
            res.send(Buffer.from(FinalInvoicePdfBytes));



        } catch (error) {
            console.log(error);

            res.status(500).json({ error: `PDF processing failed: ${error.message}` });
        }

    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;
