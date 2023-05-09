import React, { useState } from "react";
import Emoji from "../../elements/Emoji/Emoji";
import GhostBtn from "../../elements/Button/GhostBtn";
import { Title, SubTitle, QuestionInput } from "./style";
import FillBtn from "../../elements/Button/FillBtn";
import { createQuestion } from "../../apis/home";
import { toast } from "react-hot-toast";

function QuestionWrite(props: {
  setHomeContent: (homeContent: number) => void;
  groupId: number;
}) {
  const [question, setQuestion] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleClickCreateBtn = () => {
    props.setHomeContent(0);
    createQuestion(props.groupId, question)
      .then((res) => {
        toast(res.message, {
          icon: "🙋‍♂️",
        });
      })
      .catch(() => {
        toast.error("질문 생성 중 문제가 발생하였습니다.");
      });
  };
  return (
    <div>
      <Title>원하는 질문을 입력해주세요.</Title>
      <SubTitle>무잇이 궁금 하나요?</SubTitle>
      <Emoji label="🧐" />
      <QuestionInput onChange={onChange} value={question} />
      {question.length > 0 ? (
        <FillBtn label="질문 추가" onClick={handleClickCreateBtn} />
      ) : (
        <GhostBtn label="취소 하기" onClick={() => props.setHomeContent(0)} />
      )}
    </div>
  );
}

export default QuestionWrite;
