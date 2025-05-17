package com.java.backend.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * Lớp tiện ích xử lý các thao tác với ngày giờ
 */
public class DateTimeUtils {

    private static final String DEFAULT_DATE_FORMAT = "dd/MM/yyyy";
    private static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";
    private static final String DEFAULT_DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
    
    /**
     * Chuyển đổi LocalDateTime thành chuỗi theo định dạng mặc định
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DEFAULT_DATETIME_FORMAT);
        return dateTime.format(formatter);
    }
    
    /**
     * Chuyển đổi LocalDateTime thành chuỗi theo định dạng tùy chọn
     */
    public static String formatDateTime(LocalDateTime dateTime, String pattern) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return dateTime.format(formatter);
    }
    
    /**
     * Chuyển đổi LocalDate thành chuỗi theo định dạng mặc định
     */
    public static String formatDate(LocalDate date) {
        if (date == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT);
        return date.format(formatter);
    }
    
    /**
     * Chuyển đổi Date thành LocalDateTime
     */
    public static LocalDateTime toLocalDateTime(Date date) {
        if (date == null) return null;
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
    
    /**
     * Chuyển đổi LocalDateTime thành Date
     */
    public static Date toDate(LocalDateTime localDateTime) {
        if (localDateTime == null) return null;
        return Date.from(localDateTime
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }
    
    /**
     * Lấy ngày hiện tại
     */
    public static LocalDate getCurrentDate() {
        return LocalDate.now();
    }
    
    /**
     * Lấy thời gian hiện tại
     */
    public static LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now();
    }
}