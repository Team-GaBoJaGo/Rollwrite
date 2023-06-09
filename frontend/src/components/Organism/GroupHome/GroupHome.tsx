import React, { useEffect, useState, useRef } from "react";
import Calendar from "../../Molecules/Calendar/Calendar";
import { CalendarQuestion, Group } from "../../../constants/types";
import { getQuestionList, getRandomAnswer } from "../../../apis/home";
import { ReactComponent as Download } from "../../../assets/Download.svg";
import { ReactComponent as InfoSvg } from "../../../assets/Info-circle.svg";
import {
  GroupHomeCard,
  GroupHomeCardContent,
  GroupHomeCardFooter,
  GroupHomeCardHeader,
} from "./style";
import { DOG_LIST, SPROUT_LIST } from "../../../constants/sprout";
import { differenceInDays, format, getDate, subDays, subHours } from "date-fns";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { handleKakaoQuestionShare } from "../../../utils/kakaoShare";
import Modal from "../../Molecules/Modal/Modal";
import SproutList from "../../Molecules/SproutList/SproutList";
import AnswerBox from "../../Molecules/AnswerBox/AnswerBox";
import { toast } from "react-hot-toast";
import LoadingIconSmall from "../../Atom/LoadingIcon/LoadingIconSmall";
import { getUserDetail } from "../../../apis/user";
import { User } from "../../../pages/AdminPage/type";

interface Props {
  group: Group;
}
function GroupHome({ group }: Props) {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [questionMap, setQuestionMap] = useState<Map<string, CalendarQuestion>>(
    new Map()
  );
  const SproutThema = group.color === "#CEEDC7" ? DOG_LIST : SPROUT_LIST;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [randomAnswer, setRandomAnswer] = useState<{
    answer: string;
    imageUrl?: string;
  }>({
    answer: "",
  });
  const [user, setUser] = useState<User>();
  const calendarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isToday = getDate(selectedDay) <= getDate(subHours(new Date(), 8));

  useEffect(() => {
    getQuestionList(group.meetingId).then((res) => {
      const questionList = res.data;
      const newQuestionMap = new Map<string, CalendarQuestion>();
      // eslint-disable-next-line array-callback-return
      questionList.map((question: CalendarQuestion) => {
        newQuestionMap.set(question.day, question);
      });
      setQuestionMap(newQuestionMap);
    });
  }, [group.meetingId]);

  useEffect(() => {
    setRandomAnswer({ answer: "" });
  }, [selectedDay]);

  useEffect(() => {
    getUserDetail().then((res) => {
      setUser(res.data);
    });
  }, []);

  const handleDownloadClick = async () => {
    if (calendarRef.current) {
      const canvas = await html2canvas(calendarRef.current);
      const imgData = canvas.toDataURL("image/png");
      const filename = "calendar.png";

      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = imgData;
      link.download = filename;
      link.click();
      document.body.removeChild(link);
    }
  };

  const handelClickRandomAnswer = () => {
    getRandomAnswer(
      String(group.meetingId),
      format(selectedDay, "yyyy-MM-dd")
    ).then((res) => {
      if (!toastStatus) {
        setToastStatus(true);
        if (res.statusCode === 400) {
          toast.error(res.message);
        } else {
          setRandomAnswer(res.data);
          const newPoint: number = user?.point ? user?.point - 10 : 0;

          setUser(
            (prevState) =>
              ({
                ...prevState,
                point: newPoint,
              } as User)
          );
          toast.success(res.message);
        }
      }
    });
  };

  useEffect(() => {
    if (toastStatus) {
      setTimeout(() => {
        setToastStatus(false);
      }, 1000);
    }
  }, [toastStatus]);

  return (
    <>
      {isOpen && (
        <Modal width="280px" height="128px" setIsOpen={setIsOpen} color="fill">
          <SproutList thema={group.color} />
        </Modal>
      )}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <Download
          style={{ position: "absolute", right: "32px", top: "2px" }}
          onClick={handleDownloadClick}
        />
        <Calendar
          calendarRef={calendarRef}
          group={group}
          questionMap={questionMap}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
      <div
        style={{
          borderTop: "1px solid var(--gray-color)",
          height: "60px",
          lineHeight: "60px",
          width: "90%",
          margin: "auto",
          fontWeight: "bold",
          color: "var(--darkgray-color)",
        }}
      >
        {format(selectedDay, "yyyy년 MM월 dd일")}
      </div>
      <GroupHomeCard>
        <GroupHomeCardHeader>
          답변률{" "}
          {isToday && (
            <>
              {"(" +
                (questionMap.get(format(selectedDay, "yyyy-MM-dd"))
                  ?.answerCnt ?? 0)}
              /
              {(questionMap.get(format(selectedDay, "yyyy-MM-dd"))
                ?.participantCnt ?? group.participantCnt) + ")"}
            </>
          )}
          <InfoSvg onClick={() => setIsOpen(true)} />
        </GroupHomeCardHeader>
        <GroupHomeCardContent alignItem="center">
          {isToday ? (
            <>
              {
                SproutThema[
                  Math.round(
                    (questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.rate ??
                      0) / 20
                  )
                ]
              }
              {Math.round(
                questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.rate ?? 0
              )}
              %가 오늘의 질문에 답변했습니다.
            </>
          ) : (
            "질문은 8시에 생성됩니다."
          )}
        </GroupHomeCardContent>

        {questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.answer ? (
          questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.rate !== 100 ? (
            getDate(selectedDay) === getDate(subHours(new Date(), 8)) ? (
              <GroupHomeCardFooter
                onClick={() =>
                  handleKakaoQuestionShare(
                    questionMap.get(format(selectedDay, "yyyy-MM-dd"))!
                  )
                }
              >
                <div>답변 요청하기</div>
              </GroupHomeCardFooter>
            ) : (
              <></>
            )
          ) : (
            <></>
          )
        ) : getDate(selectedDay) === getDate(subHours(new Date(), 8)) ? (
          <GroupHomeCardFooter
            onClick={() =>
              navigate("/answer", {
                state: {
                  question: {
                    question: questionMap.get(format(new Date(), "yyyy-MM-dd"))
                      ?.question,
                    title: group.title,
                    day: differenceInDays(new Date(group.endDay), new Date()),
                    meetingId: group.meetingId,
                    questionId: questionMap.get(
                      format(new Date(), "yyyy-MM-dd")
                    )?.questionId,
                  },
                  isModify: false,
                },
              })
            }
          >
            <div>답변하러 가기</div>
          </GroupHomeCardFooter>
        ) : (
          <></>
        )}
      </GroupHomeCard>
      <GroupHomeCard>
        <GroupHomeCardHeader>
          답변 뽑기 {"(현재 포인트 : " + user?.point + "p)"} 🎲
        </GroupHomeCardHeader>
        <GroupHomeCardContent flexDirection="column" gap="0px">
          {questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.answer ? (
            <>
              {questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.question}
              <AnswerBox
                isMe={true}
                answer={
                  questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.answer!
                }
                imageUrl={
                  questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.imageUrl
                }
                user={user}
              />
            </>
          ) : (
            "답변하지 않은 날은 답변을 뽑을 수 없습니다."
          )}
          {toastStatus && (
            <div style={{ margin: "auto" }}>
              <LoadingIconSmall />
            </div>
          )}
          {!toastStatus && randomAnswer.answer.length > 0 && (
            <AnswerBox
              isMe={false}
              answer={randomAnswer.answer}
              imageUrl={randomAnswer.imageUrl}
            />
          )}
        </GroupHomeCardContent>
        <GroupHomeCardFooter onClick={handelClickRandomAnswer}>
          {!toastStatus &&
            questionMap.get(format(selectedDay, "yyyy-MM-dd"))?.answer && (
              <div>답변 뽑기 10p</div>
            )}
        </GroupHomeCardFooter>
      </GroupHomeCard>
    </>
  );
}

export default GroupHome;
