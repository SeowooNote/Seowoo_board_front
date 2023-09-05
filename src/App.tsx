// Router
import { Routes, Route, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// layouts import / src : 절대경로
import Header from 'src/layouts/Header';
import Footer from 'src/layouts/Footer';

// views import
import Main from './views/Main';
import Authentication from './views/Authentication';
import Search from './views/Search';
import UserPage from './views/UserPage';
import BoardDetail from './views/Board/Detail';
import BoardWrite from './views/Board/Write';
import BoardUpdate from './views/Board/Update';

// components import
import BoardListItem from './components/BoardListItem';
import Top3ListItem from './components/Top3ListItem';
import CommentListItem from './components/CommentListItem';
import InputBox from './components/InputBox';

// constants import - components 의 InPutBox 에 대한 아이콘
import { AUTHENTICATION_PATH, BOARD_NUMBER_PATH_VARIABLE, BOARD_PATH, DETAIL_PATH, INPUT_ICON, MAIN_PATH, SEARCH_PATH, SEARCH_WORD_PATH_VARIABLE, UPDATE_PATH, USER_EMAIL_PATH_VARIABLE, USER_PAGE_PATH, WRITE_PATH } from './constants';

import './App.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useUserStore } from './stores';
import { getSignInUserRequest } from './apis';
import { GetLoginUserResponseDto } from './interfaces/response/user';
import ResponseDto from './interfaces/response/response.dto';

// 메인화면 - path: '/' / component : <Main />
// 로그인 / 회원가입 - path: '/authentication' / component : <Authentication />
// 검색 - path: '/search/:searchWord' / component : <Search />
// 마이페이지 - path : '/user-page/:userEmail' / component : <UserPage />
// 게시글 상세 페이지 - path : '/board/detail/:boardNumber' / component : <BoardDetail />
// 게시글 작성 - path : '/board/write' / component : <BoardWrite />
// 게시글 수정 - path : '/board/update/:boardNumber' / component : <BoardUpdate />

function App() {
  //              state             //
  // description : 현재 페이지 url 상태
  const { pathname } = useLocation();
  // description : 유저 스토어 상태 //
  const { user, setUser } = useUserStore();
  // description : Cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function //
  const getSignInUserResponseHandler = (result: GetLoginUserResponseDto | ResponseDto) => {
    const { code } = result;
    if (code === 'NU') alert('토큰 정보가 잘못됐습니다.');
    if (code === 'DE') alert('데이터베이스 에러입니다.');
    if (code !== 'SU') return;

    setUser({...result as GetLoginUserResponseDto});
  }

  // effect //
  useEffect(() => {
    const accessToken = cookies.accessToken;
    console.log(accessToken);
    if (!user && accessToken) getSignInUserRequest(accessToken).then(getSignInUserResponseHandler);
  }, [pathname]);

  // render //
  return (
    <>
      {/* Header */}
      <Header />
      
      <Routes>

        {/* 메인화면 */}
        <Route path={MAIN_PATH} element={<Main />} />

        {/* 로그인 / 회원가입 */}
        <Route path={AUTHENTICATION_PATH} element={<Authentication />} />

        {/* 검색 */}
        <Route path={SEARCH_PATH(SEARCH_WORD_PATH_VARIABLE)} element={<Search />} />

        {/* 마이페이지 */}
        <Route path={USER_PAGE_PATH(USER_EMAIL_PATH_VARIABLE)} element={<UserPage />} />

        {/* 게시글 관련 */}
        <Route path={BOARD_PATH}>  

          {/* 게시글 상세 페이지 */}
          <Route path={DETAIL_PATH(BOARD_NUMBER_PATH_VARIABLE)} element={<BoardDetail />} />

          {/* 게시글 작성 */}
          <Route path={WRITE_PATH} element={<BoardWrite />} />

          {/* 게시글 수정 */}
          <Route path={UPDATE_PATH(BOARD_NUMBER_PATH_VARIABLE)} element={<BoardUpdate />} />

        </Route>

      </Routes>

      { pathname !== AUTHENTICATION_PATH && (<Footer />) }
    </>
  );
}

export default App;
