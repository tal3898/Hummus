import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

  .code-style {
    background-color: ]f7f7f7;
    color: ]dd1144;
    fontFamily: monospace,monospace;
    margin-bottom: 10px;
  }

  .shortcut-desc {
    padding-bottom:12px;
    font-size:20px;   
  }
`;
class InfoPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen
        };

        this.onCloseCallback = props.onClose;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.state.isOpen = newProps.isOpen;
        this.setState(this.state);
    }


    closePopup() {
        this.state.isOpen = false;
        this.setState(this.state);

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    render() {
        return (
            <Styles>
                <Popup
                    open={this.state.isOpen}
                    onClose={() => this.closePopup()}
                    modal
                    closeOnDocumentClick
                >
                    <div style={{ fontSize: 40, marginBottom: 25 }}>
                        <center>
                            <h1>Info</h1>
                        </center>
                    </div>

                    <div className="content" dir="rtl" style={{ textAlign: 'right' }}>
                        <div >
                            <h2 >מה חדש</h2>
                            <ul>
                                <li>כפתור מה חדש 😂</li>
                                <li>אימוגים 🙃</li>
                                <li>כתיבה לשדב, ול localhost</li>
                                <li>תיקוני באגים</li>
                                <li>תחפשו בעצמכם 😈</li>
                            </ul>
                        </div>
                        <div>
                            <h2>לאן הגעתי לעזאזל?</h2>
                            <p>צעירים וצריכים החתלה ראשונה במערכת? מצוין 👶</p>
                            <p>ברוכים הבאים לחומוס. פה לא תאכלו חומוס אם זה מה שציפיתם אבל תוכלו לכתוב ישויות ל NG. פחות שווה אבל גם סבבה.</p>
                            <p>בצורה הכי פשוטה אפשר לבנות בקשות כתיבה ולשלוח לNG. אם אתם רוצים לשלוח מטרה רגילה, יש ללחוץ על השלח, וזהו :). אם אתם רוצים לעשות דברים יותר מורכבים תמשיכו לקרוא. </p>

                            <p>הסבר על הפונקציונאליות של שדה:</p>

                            <img src="field-description.png" />

                            <p>ככה שדה רגיל נראה.</p>

                            <h5>מה זה כל השליפציקים שם בשדה??</h5>


                            <ol>
                                <li>האם שדה חובה [1], לא חובה [0], מעריכי [1..0] [1..1]</li>
                                <li>יצירת ערך רנדומלי. בעת השליחה של הישות, החומוס יגנרט ערך רנדומלי. ככה יהיה אפשר לשלוח ישויות שונות בלי לשנות בעצמכם את המזהה ישות. אפשר גם לכתוב איזה ערך שאתם רוצים, ולשרשר {'"{text}"'} וככה החומוס יחליף רק את הפרמטר הזה בערך רנדומלי. בצורה הזאת: </li>
                                <img src="field-text-example.png" />
                                <li>כיבוי שדה. שדה שעדין יהיה ויזואלי, אבל לא נחשב בגיסון. לא ניתן יהיה לראות אותו בגיסון הסופי, והוא לא ישלח ל NG. (זה נוח אם רוצים כל פעם לשלוח תת ישות ופעם לא)</li>
                                <li>פותח tooltip קטן, שמראה תיאור מלא (לא תמיד) של השדה, ונתיב מלא של השדה.</li>
                                <li>מוחק את השדה מהגיסון</li>
                            </ol>

                        </div>
                    </div>


                </Popup>
            </Styles>
        )
    }
}

export default InfoPopup;