package com.example.demo.service;

import com.example.demo.dto.request.BookRequest;
import com.example.demo.entity.Book;
import com.example.demo.entity.BookImage;
import com.example.demo.repository.BookImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookImageService {
    
    private final BookImageRepository bookImageRepository;
    
    /**
     * Tạo mới BookImage record cho sách
     */
    @Transactional
    public BookImage createBookImages(Book book, BookRequest request) {
        // Xóa ảnh cũ nếu tồn tại
        bookImageRepository.deleteByBookId(book.getId());
        
        // Tạo mới record với 3 URL
        BookImage bookImage = BookImage.builder()
                .book(book)
                .imageUrl1(request.getImageUrl1())
                .imageUrl2(request.getImageUrl2())
                .imageUrl3(request.getImageUrl3())
                .build();
        
        return bookImageRepository.save(bookImage);
    }
    
    /**
     * Cập nhật BookImage của sách
     */
    @Transactional
    public BookImage updateBookImages(Book book, BookRequest request) {
        Optional<BookImage> existingImage = bookImageRepository.findByBookId(book.getId());
        
        BookImage bookImage;
        if (existingImage.isPresent()) {
            bookImage = existingImage.get();
            bookImage.setImageUrl1(request.getImageUrl1());
            bookImage.setImageUrl2(request.getImageUrl2());
            bookImage.setImageUrl3(request.getImageUrl3());
        } else {
            bookImage = BookImage.builder()
                    .book(book)
                    .imageUrl1(request.getImageUrl1())
                    .imageUrl2(request.getImageUrl2())
                    .imageUrl3(request.getImageUrl3())
                    .build();
        }
        
        return bookImageRepository.save(bookImage);
    }
    
    /**
     * Xóa BookImage của sách
     */
    @Transactional
    public void deleteBookImages(Long bookId) {
        bookImageRepository.deleteByBookId(bookId);
    }
}
