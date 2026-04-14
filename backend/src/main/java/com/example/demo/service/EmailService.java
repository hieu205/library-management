package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.UserRequest;
import com.example.demo.entity.BorrowItem;
import com.example.demo.entity.BorrowRecord;
import com.example.demo.entity.User;
import com.example.demo.repository.BorrowItemRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender javaMailSender;

    private final BorrowRecordRepository borrowRecordRepository;

    private final BorrowItemRepository borrowItemRepository;

    // 8h
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendGmailbefore() {
        List<BorrowRecord> res = borrowRecordRepository.findByDueDateAndStatus(LocalDate.now().plusDays(1),
                "BORROWING");

        for (BorrowRecord x : res) {
            List<BorrowItem> ans = borrowItemRepository.findByBorrowRecord_Id(x.getId());
            String NameBook = "";
            for (BorrowItem it : ans) {
                NameBook = it.getBook().getTitle();
            }
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("doanminhhieu08022005@gmail.com");
            message.setTo(x.getUser().getEmail());
            message.setSubject("Nhắc trả sách");
            message.setText("Bạn cần trả sách " + NameBook + " trước ngày mai");
            javaMailSender.send(message);
            log.info("Đã gửi thông tin nhắc nhở mail tới: {}", x.getUser().getEmail());
        }
    }

    // 8h30 (vì để tránh trùng log với gmail nhắc nhở trên)
    @Scheduled(cron = "0 30 8 * * ?")
    public void sendGmailAfter() {
        List<BorrowRecord> res = borrowRecordRepository.findByStatus("BORROWING");

        for (BorrowRecord x : res) {
            if (x.getDueDate().isBefore(LocalDate.now())) {
                List<BorrowItem> ans = borrowItemRepository.findByBorrowRecord_Id(x.getId());
                String NameBook = "";
                for (BorrowItem it : ans) {
                    NameBook = it.getBook().getTitle();
                }
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("doanminhhieu08022005@gmail.com");
                message.setTo(x.getUser().getEmail());
                message.setSubject("Nhắc trả sách ");
                message.setText("Bạn đã mượn quá số ngày mượn sách: " + NameBook);
                javaMailSender.send(message);
                log.info("Đã gửi thông tin quá hạn mược sách mail tới: {}", x.getUser().getEmail());

            }
        }
    }
}
