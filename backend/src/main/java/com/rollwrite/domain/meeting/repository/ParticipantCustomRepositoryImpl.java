package com.rollwrite.domain.meeting.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.rollwrite.domain.meeting.entity.Meeting;
import com.rollwrite.domain.meeting.entity.QParticipant;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ParticipantCustomRepositoryImpl implements ParticipantCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    QParticipant participant = QParticipant.participant;

    @Override
    public List<Meeting> findMeetingByUserAndIsDone(Long userId, boolean isDone) {
        return jpaQueryFactory
            .select(participant.meeting)
            .from(participant)
            .where(participant.user.id.eq(userId))
            .where(participant.isDone.eq(isDone))
            .fetch();
    }

    @Override
    public Optional<Meeting> findMeetingByUserAndMeetingAndIsDone(Long userId, Long meetingId,
        boolean isDone) {
        return Optional.ofNullable(jpaQueryFactory
            .select(participant.meeting)
            .from(participant)
            .where(participant.user.id.eq(userId))
            .where(participant.meeting.id.eq(meetingId))
            .where(participant.isDone.eq(isDone))
            .fetchOne());
    }
}