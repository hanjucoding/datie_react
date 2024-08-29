import React from 'react';
import styled from 'styled-components';
import PayLoginForm from './PayLoginForm';
import ResponsiveAppBar from '../RealHeader';
import Footer from '../Footer';
import Header from '../Header';

function PayLoginPage() {
    return (
        <div>
            <ResponsiveAppBar />
            <Header title={'로그인'} />
            <StyledLoginPage>
                <PayLoginForm />
            </StyledLoginPage>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

const StyledLoginPage = styled.main`
    background-color: #fff;
    flex-direction: column;
    padding: 16px;
    text-align: center;
`;

export default PayLoginPage;
