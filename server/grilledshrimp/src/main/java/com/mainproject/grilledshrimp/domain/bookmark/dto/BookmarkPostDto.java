package com.mainproject.grilledshrimp.domain.bookmark.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 북마크 생성
@AllArgsConstructor
@Getter
public class BookmarkPostDto {
    private Long user_id;
    private Long post_id;
    private String bookmark_name;
}
