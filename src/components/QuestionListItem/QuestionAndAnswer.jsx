import { useState, useEffect } from 'react';

import { date } from '../../utils/day';
import Dropdown from './Dropdown/index';
import { deleteQuestion, patchAnswer, postAnswer } from '../../api'; // 답변 수정 및 추가 API 불러오기
import AnswerCreateAndEdit from '../AnswerCreateAndEdit/index'; // 수정 컴포넌트 가져오기
import ReactionButtons from './ReactionButton'; // 좋아요/싫어요 컴포넌트 불러오기

import styles from './QuestionListItem.module.css';

function QuestionAndAnswer({
  question,
  questionDate,
  answer,
  answerDate,
  name,
  like,
  dislike,
  isRejected,
  questionId,
  answerId,
  isSubjectOwner,
  imageSource,
  onUpdate,
}) {
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태
  const [currentAnswer, setCurrentAnswer] = useState(answer); // 현재 답변 상태 관리

  useEffect(() => {
    setCurrentAnswer(answer); // answer가 변경되면 상태 업데이트
  }, [answer]);

  // 수정하기 핸들러
  const handleEdit = () => {
    setIsEditMode(true); // 수정 모드로 전환
  };

  // 삭제하기 핸들러
  const handleDelete = async () => {
    await deleteQuestion(questionId);
    onUpdate();
  };

  // 수정 완료 핸들러
  const handleSave = async (newContent, answerId) => {
    try {
      await patchAnswer(newContent, answerId);
      setIsEditMode(false); // 수정 완료 후 수정 모드 해제
      onUpdate();
    } catch (error) {
      alert('답변 수정에 실패했습니다.');
    }
  };

  // 답변 거절 핸들러
  const handleRefuse = async () => {
    const content = '거절된 답변입니다.';
    const isRejected = true;

    try {
      if (currentAnswer) {
        // 답변이 이미 있을 때는 거절 상태로 업데이트
        await patchAnswer(content, question.answer.id, isRejected);
      } else {
        // 답변이 없을 때는 거절된 기본 답변 생성
        await postAnswer(content, question.id, isRejected);
      }

      // 로컬 상태와 UI 업데이트
      setCurrentAnswer({ content, isRejected });
      onUpdate();
    } catch (error) {
      alert('답변 거절에 실패했습니다.');
    }
  };

  // 새 답변 추가 핸들러
  const handlePostAnswer = async (newContent, questionId) => {
    try {
      await postAnswer(newContent, questionId); // 새 답변 추가 API 호출
      setIsEditMode(false); // 답변 추가 후 수정 모드 해제
      onUpdate();
    } catch (error) {
      alert('답변 추가에 실패했습니다.');
    }
  };

  return (
    <div className={styles.select}>
      <div className={styles.header}>
        <span
          className={styles.badge}
          style={{
            borderColor: answer ? '#542f1a' : '#818181',
            color: answer ? '#542f1a' : '#818181',
          }}
        >
          {answer ? '답변 완료' : '미답변'}
        </span>
        {isSubjectOwner && (
          <Dropdown onEdit={handleEdit} onDelete={handleDelete} onRefuse={handleRefuse} />
        )}
      </div>

      <div className={styles.container}>
        <p className={styles.question}>질문 · {date(questionDate)}</p>
        <p>{question.content}</p>
      </div>

      {isEditMode || (isSubjectOwner && !answer) ? (
        <AnswerCreateAndEdit
          answerId={answerId}
          questionId={questionId}
          initialContent={answer?.content || ''}
          onSave={handleSave}
          postAnswer={handlePostAnswer}
          imageSource={imageSource}
          name={name}
        />
      ) : (
        <AnswerContentItem
          name={name}
          imageSource={imageSource}
          answerDate={answerDate}
          isRejected={isRejected}
          currentAnswer={answer}
          like={like}
          dislike={dislike}
          questionId={questionId}
        />
      )}
      <ReactionButtons questionId={questionId} initialLikes={like} initialDislikes={dislike} />
    </div>
  );
}

function AnswerContentItem({ name, imageSource, answerDate, isRejected, currentAnswer }) {
  return (
    <>
      {currentAnswer && (
        <div className={`${styles.answerContainer} text-left`}>
          <div className={styles.profile}>
            <img
              src={imageSource}
              alt={`${name}의 프로필 이미지`}
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px' }}
            />
            <div className={styles.answer}>
              <div className={styles.nameday}>
                <p>{name}</p>
                <p className={styles.day}>{date(answerDate)}</p>
              </div>

              {isRejected ? (
                <p className="text-base text-[#B93333]">답변 거절</p>
              ) : (
                <p className={styles.answerValue}>{currentAnswer.content}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionAndAnswer;
