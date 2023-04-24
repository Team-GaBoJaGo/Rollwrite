package com.rollwrite.domain.meeting.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.rollwrite.domain.meeting.entity.Participant;
import com.rollwrite.domain.meeting.entity.QParticipant;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ParticipantCustomRepositoryImpl implements ParticipantCustomRepository {

    private final JPAQueryFactory queryFactory;

    QParticipant participant = QParticipant.participant;

    @Override
    public List<Participant> findInProgressMeeting(Long userId) {
        return queryFactory
            .selectFrom(participant)
            .where(participant.user.id.eq(userId))
            .where(participant.isDone.eq(false))
            .fetch();
    }
}
