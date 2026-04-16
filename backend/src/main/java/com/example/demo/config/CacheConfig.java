package com.example.demo.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    // các biến cấu hình mặc định
    private static final int DEFAULT_CACHE_SIZE = 1000;
    private static final int SMALL_CACHE_SIZE = 100;
    private static final int LARGE_CACHE_SIZE = 5000;

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Cache tĩnh - Author (TTL: 24 giờ)
        cacheManager.registerCustomCache(
                "authors",
                Caffeine.newBuilder()
                        .maximumSize(SMALL_CACHE_SIZE)
                        .expireAfterWrite(24, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache tĩnh - Category (TTL: 24 giờ)
        cacheManager.registerCustomCache(
                "categories",
                Caffeine.newBuilder()
                        .maximumSize(SMALL_CACHE_SIZE)
                        .expireAfterWrite(24, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache tĩnh - Books (TTL: 6 giờ)
        cacheManager.registerCustomCache(
                "books",
                Caffeine.newBuilder()
                        .maximumSize(LARGE_CACHE_SIZE)
                        .expireAfterWrite(6, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache động - Book Search (TTL: 4 giờ)
        cacheManager.registerCustomCache(
                "book_search",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(4, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache động - Inventory (TTL: 10 phút)
        cacheManager.registerCustomCache(
                "inventory",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(10, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        // Cache động - User Profile (TTL: 30 phút)
        cacheManager.registerCustomCache(
                "user_profiles",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(30, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        // Cache động - Borrow Status (TTL: 5 phút)
        cacheManager.registerCustomCache(
                "borrow_pending",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        // Cache động - Borrow History (TTL: 10 phút)
        cacheManager.registerCustomCache(
                "borrow_history",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(10, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        // Cache Reports - Top Books (TTL: 1 giờ)
        cacheManager.registerCustomCache(
                "report_top_books",
                Caffeine.newBuilder()
                        .maximumSize(SMALL_CACHE_SIZE)
                        .expireAfterWrite(1, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache Reports - Top Users (TTL: 1 giờ)
        cacheManager.registerCustomCache(
                "report_top_users",
                Caffeine.newBuilder()
                        .maximumSize(SMALL_CACHE_SIZE)
                        .expireAfterWrite(1, TimeUnit.HOURS)
                        .recordStats()
                        .build());

        // Cache Reports - Overdue (TTL: 30 phút)
        cacheManager.registerCustomCache(
                "report_overdue",
                Caffeine.newBuilder()
                        .maximumSize(SMALL_CACHE_SIZE)
                        .expireAfterWrite(30, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        // Cache Reports - Borrowing Books (TTL: 15 phút)
        cacheManager.registerCustomCache(
                "report_borrowing_books",
                Caffeine.newBuilder()
                        .maximumSize(DEFAULT_CACHE_SIZE)
                        .expireAfterWrite(15, TimeUnit.MINUTES)
                        .recordStats()
                        .build());

        return cacheManager;
    }
}