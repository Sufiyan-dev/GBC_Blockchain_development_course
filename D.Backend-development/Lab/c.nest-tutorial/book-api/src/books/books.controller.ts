import { Body, Controller, Get, Post } from "@nestjs/common";
import { BooksService } from "./books.service";
import { Book } from "./books.entity";

@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) {}

    @Get()
    getAllBooks(): Book[] {
        return this.bookService.getAllBooks();
    }

    @Post()
    createBook(@Body() book: Book): void {
        this.bookService.createBook(book);
    }
}