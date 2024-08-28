import './App.css';
import { Routes, Route } from 'react-router-dom';
import CardApplicationComplete from './component/cardcompletion/CardApplicationComplete';
import SignUpComponent from './component/register_first/SignUpForm_first';
import SignUpForm from './component/register_second/SignUpForm';
import CardCreationForm from './component/cardselection_first/CardCreationForm';
import ProfileComparison from './component/cardselection_second/ProfileComparison';
import CardInfoInput from './component/cardselection_3/CardInfoInput';
import LoginPage from './component/Login/LoginPage';
import Paypassword from './component/pay/Paypassword';

import PayInfo from './component/pay/PayInfo';
import IndexMain from './component/mainIndex/IndexMain';
import LoginMain from './component/mainIndex/LoginMain';
import Payresult from './component/pay/Payresult';
import AdminMember from './component/admin/AdminMember';
import AdminStatistics from './component/admin/AdminStatistics';
import CardPasswordChange from './component/profile/CardPasswordChange';
import CardLostReport from './component/profile/CardLostReport';
import CardLostReportCancellation from './component/profile/CardLostReportCancellation';
import CardCancellation from './component/profile/CardCancellation';
import EditProfile from './component/profile/EditProfile';
import ViewProfile from './component/profile/ViewProfile';
import DiaryDetail from './component/diary/pages/DiaryDetail';
import DiaryHome from './component/diary/pages/DiaryHome';

function App() {
    return (
        <Routes>
            <Route path="/verify" element={<SignUpComponent />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/search_lover" element={<CardCreationForm />} />
            <Route path="/card_selection" element={<ProfileComparison />} />
            <Route path="/card_info" element={<CardInfoInput />} />
            <Route
                path="/card_complete"
                element={<CardApplicationComplete />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<IndexMain />} />
            <Route path="/main" element={<LoginMain />} />
            <Route path="/paymentRecord" element={<PaymentRecord />} />

            <Route path="/pay/PayLoginPage" element={<PayLogin />} />
            <Route path="/pay/Paypassword" element={<Paypassword />} />
            <Route path="/pay/Payresult" element={<Payresult />} />

            <Route path="/pay/PayInfo" element={<PayInfo />} />
            <Route path="/admin/member" element={<AdminMember />} />
            <Route path="/admin" element={<AdminStatistics />} />
            <Route path="/card-lost-report" element={<CardLostReport />} />
            <Route
                path="/card-lost-report-cancellation"
                element={<CardLostReportCancellation />}
            />
            <Route path="/card-cancellation" element={<CardCancellation />} />
            <Route
                path="/change-cardpassword"
                element={<CardPasswordChange />}
            />
            <Route path="/edit-profile/:userno" element={<EditProfile />} />
            <Route path="/view-profile/:userno" element={<ViewProfile />} />
            <Route path="/diary" element={<DiaryHome />} />
            <Route path="/diary/detail/:date" element={<DiaryDetail />} />

            <Route path="/" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
