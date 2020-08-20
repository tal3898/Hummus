import React, { useState } from "react";
import EntitySelectInput from '../EntitySelectInput/EntitySelectInput'

export default function LinkTarget(props) {
        //this.currStepEnglishCount = JSON.parse(this.context.data.currScenario.steps[this.context.data.currOpenStep].jsonToEdit).English.length;

    const currStepEnglishCount  =  3;
    return (
        <div>
            <p >* מספר הישויות שניתן לקשר תואם למספר הקישורים שקיימים בגיסון. אם אתם רוצים לקשר יותר ישויות, תוסיפו קישורים לגיסון.</p>
            {new Array(currStepEnglishCount).fill(0).map(index =>
                <div rtl>
                    <center>
                        <h2>מטרה</h2>
                    </center>
                    <div>
                        <div dir="rtl" style={{ paddingTop: 10, display: 'inline-block' }}>
                            <input
                                style={{ marginLeft: 10 }}
                                dir="rtl"
                                type="checkbox"
                                id="intelConn" />
                            <label for="intelConn">קישור  1</label>
                        </div>
                        <EntitySelectInput style={{ float: 'left' }} />
                    </div>
                    <div>
                        <div dir="rtl" style={{ paddingTop: 10, display: 'inline-block' }}>
                            <input
                                style={{ marginLeft: 10 }}
                                dir="rtl"
                                type="checkbox"
                                id="agamConn" />
                            <label for="agamConn">קישור 2</label>
                        </div>
                        <EntitySelectInput style={{ float: 'left' }} />
                    </div>


                    <br />
                </div>

            )}

        </div>
    );
}
