package com.example.demo.repository;

public interface BorrowingBookProjection {
    Long getBookId();

    String getTitle();

    String getIsbn();

    Long getQuantityCurrentlyBorrowed();

    Long getActiveBorrowCount();
}
