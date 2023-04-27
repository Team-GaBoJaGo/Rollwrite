import React from "react";
import {
  CardContainer,
  TagContainer,
  Title,
  SubTitle,
  HorizontalBtn,
} from "./style";
import GroupTag from "../../elements/GroupTag/GroupTag";
import { ReactComponent as Person } from "../../assets/Person.svg";
import { GroupInfo } from "../../constants/types";

function GroupCard(props: {
  groupInfo?: GroupInfo;
  width?: string;
  margin?: string;
}) {
  return (
    <CardContainer
      width={props.width !== undefined ? props.width : ""}
      margin={props.margin !== undefined ? props.margin : "8px 20px 16px"}
      color={props.groupInfo?.color}
    >
      <div>
        <Title>
          <div>{props.groupInfo?.title}</div>
        </Title>
        <SubTitle>
          {props.groupInfo?.startDay}~{props.groupInfo?.endDay}
        </SubTitle>
      </div>
      <TagContainer>
        {props.groupInfo?.tag.map((tag, i) => (
          <GroupTag label={tag.content} key={i} />
        ))}
      </TagContainer>

      <HorizontalBtn>
        <Person />
        <p>{props.groupInfo?.participantCnt}</p>
      </HorizontalBtn>
    </CardContainer>
  );
}

export default GroupCard;
