const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;

app.use(express.json());

const filePath = path.join(__dirname, "books.json");

app.post("/books", (req, res) => {
    const { title, author, publishedYear } = req.body;

    if (!title || !author || !publishedYear) {
        return res.status(400).json({
            success: false,
            message: "title, author and publishedYear are required"
        });
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to read books.json"
            });
        }

        const books = JSON.parse(data);

        const newBook = {
            id: books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1,
            title,
            author,
            publishedYear,
            available: true
        };

        books.push(newBook);

        fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf8", (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to save book"
                });
            }

            res.status(201).json({
                success: true,
                message: "Book added successfully",
                data: newBook
            });
        });
    });
});

app.get("/books", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to read books.json"
            });
        }

        const books = JSON.parse(data);

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});