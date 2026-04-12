package com.example.demo.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookImageResponse {

    private Long id;
    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
