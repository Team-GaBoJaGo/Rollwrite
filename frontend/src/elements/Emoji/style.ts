import styled, { css } from "styled-components";

const EmojiContainer = styled.div<{ imgSrc?: string; size?: string }>`
  font-family: "Tossface";
  height: ${(props) => props.size || "200px"};
  width: ${(props) => props.size || "200px"};
  border-radius: 8px;
  line-height: ${(props) => props.size || "200px"};
  font-size: ${(props) => props.size || "180px"};
  text-align: center;
  margin-inline: auto;
  ${(props) =>
    props.imgSrc &&
    css`
      background-image: url(${props.imgSrc});
      background-size: cover;
    `}

  @media (height < 700px) {
    height: 160px;
    width: 160px;
    line-height: 160px;
    font-size: 140px;
  }
`;

export { EmojiContainer };
