package com.rollwrite.domain.admin.controller;

import com.rollwrite.domain.admin.dto.*;
import com.rollwrite.domain.admin.service.AdminService;
import com.rollwrite.global.auth.CustomUserDetails;
import com.rollwrite.global.model.ApiResponse;
import com.rollwrite.global.model.SuccessCode;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(tags = {"05. Admin-Controller (관리자 페이지 관련)"})
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/notice")
    public ResponseEntity<ApiResponse> noticeList() {
        log.info("noticeList 호출");
        List<FindNoticeResDto> findNoticeResDtoList = adminService.findNotice();
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.FIND_NOTICE_SUCCESS, findNoticeResDtoList), HttpStatus.OK);
    }

    @PostMapping("/notice")
    public ResponseEntity<ApiResponse> addNotice(@ApiIgnore Authentication authentication,
                                                 @RequestBody AddContentReqDto addContentReqDto) {
        log.info("공지 생성 addContentReqDto : {}", addContentReqDto);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();
        Long userId = userDetails.getUserId();
        adminService.addNotice(userId, addContentReqDto.getContent());
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.ADD_NOTICE_SUCCESS), HttpStatus.OK);
    }

    @PutMapping("/notice/{noticeId}")
    public ResponseEntity<ApiResponse> modifyNotice(@ApiIgnore Authentication authentication,
                                                    @PathVariable Long noticeId,
                                                    @RequestBody AddContentReqDto addContentReqDto) {
        log.info("공지 수정 noticeId : {}, addContentReqDto : {}", noticeId, addContentReqDto);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();
        Long userId = userDetails.getUserId();
        adminService.modifyNotice(userId, noticeId, addContentReqDto.getContent());
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.MODIFY_NOTICE_SUCCESS), HttpStatus.OK);
    }

    @DeleteMapping("/notice/{noticeId}")
    public ResponseEntity<ApiResponse> removeNotice(@ApiIgnore Authentication authentication,
                                                    @PathVariable Long noticeId) {
        log.info("공지 삭제 noticeId : {}", noticeId);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();
        Long userId = userDetails.getUserId();
        adminService.removeNotice(userId, noticeId);
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.REMOVE_NOTICE_SUCCESS), HttpStatus.OK);
    }

    @GetMapping("/user/{type}")
    public ResponseEntity<ApiResponse> userList(@PathVariable String type) {
        log.info("{} 조회", type);
        List<FindUserResDto> findUserResDtoList = adminService.findUser(type);
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.FIND_USER_SUCCESS, findUserResDtoList), HttpStatus.OK);
    }

    @PutMapping("/type/{userId}")
    public ResponseEntity<ApiResponse> modifyUserType(@PathVariable Long userId) {
        log.info("사용자 타입 변경 userId : {}", userId);
        adminService.modifyUserType(userId);
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.MODIFY_USER_SUCCESS), HttpStatus.OK);
    }

    @GetMapping("/tag")
    public ResponseEntity<ApiResponse> tagList() {
        log.info("tagList 호출");
        List<FindTagResDto> findTagResDtoList = adminService.findTag();
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.FIND_TAG_SUCCESS, findTagResDtoList), HttpStatus.OK);
    }

    @PostMapping("/tag")
    public ResponseEntity<ApiResponse> addTag(@RequestBody AddContentReqDto addContentReqDto) {
        log.info("태그 생성 addContentReqDto : {}", addContentReqDto);
        adminService.addTag(addContentReqDto.getContent());
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.ADD_TAG_SUCCESS), HttpStatus.OK);
    }

    @PutMapping("/tag/{tagId}")
    public ResponseEntity<ApiResponse> modifyTag(@PathVariable Long tagId,
                                                 @RequestBody AddContentReqDto addContentReqDto) {
        log.info("태그 수정 tagId : {}, addContentReqDto : {}", tagId, addContentReqDto);
        adminService.modifyTag(tagId, addContentReqDto.getContent());
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.MODIFY_TAG_SUCCESS), HttpStatus.OK);
    }

    @GetMapping("/meeting")
    public ResponseEntity<ApiResponse> meetingList() {
        log.info("meetingList 호출");
        List<FindMeetingResDto> findMeetingResDtoList = adminService.findMeeting();
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.FIND_MEETING_SUCCESS, findMeetingResDtoList), HttpStatus.OK);
    }

    @PostMapping("/question/{meetingId}")
    public ResponseEntity<ApiResponse> addTodayQuestion(@PathVariable Long meetingId) {
        log.info("오늘의 질문 수동 생성  meetingId : {}", meetingId);
        adminService.addTodayQuestion(meetingId);
        return new ResponseEntity<>(ApiResponse.success(SuccessCode.ADD_TODAY_QUESTION_SUCCESS), HttpStatus.OK);
    }

}
