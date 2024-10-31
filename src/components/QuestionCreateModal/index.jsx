import icon_message from '../../assets/images/icon-message.svg';
import icon_close from '../../assets/images/icon-close.svg';
import test_profile from '../../assets/images/test-profile.svg';
import styles from './QuestionCreateModal.module.css';
import { useEffect, useRef, useState } from 'react';
import { postQuestion } from '../../api';
import { useParams } from 'react-router-dom';

/**
 * 질문 내용의 유효성 검사 함수
 * @param {string} content 질문 내용
 * @returns 질문의 유효성 여부
 */
function checkContentValid(content) {
  if (content.length > 0) return true;
  else return false;
}

/**
 * 피드에 대한 질문 입력 폼을 담고 있는 모달 컴포넌트
 * @param {object} props
 * @param {object} props.profile 피드 프로필 정보
 * @param {string} props.profile.name 피드 이름
 * @param {string} props.profile.imageSource 피드 프로필 경로
 * @param {function} props.onClick 모달 on/off 상태를 조작할 함수
 * @returns {React.JSX} 질문 입력 모달 컴포넌트
 */
function QuestionCreateModal({ profile, onClick }) {
  const [content, setContent] = useState('');
  const { name, imageSource } = profile;
  const { id: subjectId } = useParams();
  const modalRef = useRef();

  const handleChangeContent = (e) => setContent(e.target.value.trim());
  const handleClickClose = () => {
    console.log('click');
    onClick(false);
  };

  /**
   * 모달 밖을 클릭하면 모달을 강조해주는 애니메이션 클래스를 추가함
   * 애니메이션이 끝나면 클래스를 제거함
   * @param {Event} e
   */

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    await postQuestion(content, subjectId);
    // 로딩 디자인
    alert('질문 등록이 완료되었습니다.');
    handleClickClose();
  };

  useEffect(() => {
    const handleClickModalOutside = (e) => {
      if (!modalRef.current.contains(e.target)) {
        const modal = document.querySelector('#modal');
        modal.classList.add(styles.highlight);
        modal.addEventListener('animationend', () => {
          modal.classList.remove(styles.highlight);
        });
      }
    };
    document.addEventListener('click', handleClickModalOutside);
    return () => document.removeEventListener('click', handleClickModalOutside);
  }, []);

  return (
    <div className={styles.modalBackground}>
      <div id="modal" className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <div className={styles.text}>
            <img src={icon_message} alt="메세지 아이콘" className="size-7" />
            <span>질문을 작성해 주세요</span>
          </div>
          <img
            className={styles.btnClose}
            src={icon_close}
            alt="닫기 버튼"
            onClick={handleClickClose}
          />
        </div>
        <div className={styles.destination}>
          <span className="to">To.</span>
          <img src={imageSource || test_profile} alt={name} />
          <span>{name}</span>
        </div>
        <QuestionCreateForm
          isValid={checkContentValid(content)}
          onChange={handleChangeContent}
          onSubmit={handleSubmitQuestion}
        />
      </div>
    </div>
  );
}

function QuestionCreateForm({ isValid, onChange, onSubmit }) {
  return (
    <form className={styles.questionCreateFrom} onSubmit={onSubmit}>
      <textarea
        name="content"
        type="text"
        placeholder="질문을 입력하세요"
        required
        onChange={onChange}
      />
      <button type="submit" disabled={!isValid}>
        질문 보내기
      </button>
    </form>
  );
}

export default QuestionCreateModal;
