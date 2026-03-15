package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "book_authors")
@IdClass(BookAuthorId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookAuthor {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;
}
