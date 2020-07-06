import React from 'react';
import styled from 'styled-components';
import Popup from "reactjs-popup";

const Styles = styled.div`

.feature-list-item {
    margin-bottom:11px;
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

                    <div className="content" dir="rtl" style={{ textAlign: 'right',height:500, overflowY:'scroll', paddingRight:30, paddingLeft:30 }}>
                        <div >
                            <h2 >מה חדש</h2>
                            <ul>
                                <li>כפתור מה חדש (לול)</li>
                                <li>אימוגים 🙃</li>
                                <li>כתיבה לשדב, ול localhost</li>
                                <li>תיקוני באגים</li>
                                <li>הסבר על כל הפיצרים של החומוס</li>
                                <li>תחפשו בעצמכם 😈😈😈</li>
                            </ul>
                        </div>
                        <div>
                            <h2>לאן הגעתי לעזאזל?</h2>
                            <p>צעירים וצריכים החתלה? מצוין 👶</p>
                            <p>ברוכים הבאים לחומוס. פה לא תאכלו חומוס אם זה מה שציפיתם אבל תוכלו לכתוב ישויות ל NG. פחות שווה אבל גם סבבה.</p>
                            <p>בצורה הכי פשוטה אפשר לבנות בקשות כתיבה ולשלוח לNG. אם אתם רוצים לשלוח מטרה רגילה פשוטה, יש ללחוץ על השלח, וזהו :)  (קצת נעלבתי אבל בסדר). אם אתם רוצים לעשות דברים יותר מורכבים תמשיכו לקרוא. </p>

                            <h2>הסבר על כל הפיצרים של חומוס</h2>
                            <br/>
                            <img src="field-description.png" />

                            <p>ככה שדה רגיל נראה.</p>

                            <h5>מה זה כל השליפציקים שם בשדה??</h5>


                            <ol>
                                <li className="feature-list-item">האם שדה חובה [1], לא חובה [0], מעריכי [1..0] [1..1]</li>
                                <li className="feature-list-item">יצירת ערך רנדומלי. בעת השליחה של הישות, החומוס יגנרט ערך רנדומלי. ככה יהיה אפשר לשלוח ישויות שונות בלי לשנות בעצמכם את המזהה ישות. אפשר גם לכתוב איזה ערך שאתם רוצים, ולשרשר {'"{text}"'} וככה החומוס יחליף רק את הפרמטר הזה בערך רנדומלי. בצורה הזאת: <img src="field-text-example.png" /></li>
                                
                                <li className="feature-list-item">כיבוי/הפעלה שדה. שדה מכובה עדין יהיה ויזואלי למשתמש, אבל לא ישלח בגיסון. לא ניתן יהיה לראות אותו בגיסון הסופי, והוא לא ישלח ל NG. (זה נוח אם רוצים כל פעם לשלוח תת ישות ופעם לא) שדה מכובה נראה ככה: <img src="disabled-field-description.png" /> </li> 
                                <li className="feature-list-item">פותח tooltip קטן, שמראה תיאור מלא (לא תמיד) של השדה, ונתיב מלא של השדה.</li>
                                <li className="feature-list-item">מוחק את השדה מהגיסון</li>
                            </ol>
 
                            <h5>אמא אפשר לעשות כתיבה היררכית???</h5>

                            <p>בטח שאפשר בן. איזי פיזי. כל בקשת כתיבה נחשבת ל'צעד'. ובכל בקשת כתיבה כמובן (אם אתם מכירים את כתיבה), אפשר לשלוח רק סוג ישות אחת. לכן, כדי לכתוב היררכית, יש להוסיף צעדים כמספר הבקשות שלכם. כמובן אתם יכולים לתת שם לצעדים שיהיה לכם ברור מה זה כל צעד.</p>

                            <p>יצרתם כמה צעדים, ולא היה לכם כח כל פעם להעתיק מזהה של ישות לקישור שלה בישות מתחת בהיררכיה? או שיניתם מזהה ולא היה לכם כח לעדכן בכל ההיררכיה? </p>
                            <p>אה איזי פיזי.</p>

                            <span>אפשר לקשר שדות בין צעדים. לוחצים על הכפתור </span>
                            <img src="link-button-description.png" />

                            <p>בוחרים את הצעד ממנו רוצים להעתיק את הערך. בוחרים את השדה ממנו רוצים להעתיק את הערך. אחרי זה בוחרים את השדה, בצעד הנוכחי, אליו רוצים להעתיק את הערך. וזהו. </p>
                            <span>לוחצים על הכפתור: </span>
                            <img src="send-all-description.png" />

                            <p>והחומוס שולח את כל הצעדים, ומעתיק אוטומטית את הערכים מהצעדים הראשונים, לצעדים שאחריהם, ככה שאתם לא צריכים להעתיק את המזהה של הישות כל פעם לישויות מתחת בהיררכיה.</p>

                            <p>אמרתי כבר שזה איזי פיזי?</p>

                            <h5>בניתם כתיבה מטורפת, כזאת שצריך לעשות לה share באינסטוש??</h5>

                            <p>אפשר לשמור את מה שעשיתם. נותנים שם לתרחיש, תיאור אם אתם רוצים, ושומרים בתקייה שלכם. אם אין לכם תקייה פנו לטל שיצור לכם בדיבי. אתם יכולים גם להשתמש בתרחישים שמורים של אנשים אחרים בצוות שלכם, ככה שתוכלו לשתף תרחישים נפוצים אצלכם.</p>
                            

                        </div>
                    </div>


                </Popup>
            </Styles>
        )
    }
}

export default InfoPopup;