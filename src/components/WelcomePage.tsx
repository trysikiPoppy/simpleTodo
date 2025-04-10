import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/todoStyles.css';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="background-image"></div>

            <div className="welcome-content">
                <h1 className="welcome-title">Pick some new habits to get started</h1>

                <div className="bottom-content">
                    <div className="recommended-section">
                        <span className="recommended-label">RECOMMENDED</span>

                        <div className="marquee-container">
                            <div className="marquee">
                                <div className="marquee-content">
                                    <span className="habit-tag">Journal</span>
                                    <span className="habit-tag">Stretch for 15 mins</span>
                                    <span className="habit-tag">Review goals before bed</span>
                                    <span className="habit-tag">Exercise</span>
                                    <span className="habit-tag">Read books</span>
                                    <span className="habit-tag">Journal</span>
                                    <span className="habit-tag">Stretch for 15 mins</span>
                                    <span className="habit-tag">Review goals before bed</span>
                                </div>
                            </div>

                            <div className="marquee">
                                <div className="marquee-content" style={{ animationDelay: '2s' }}>
                                    <span className="habit-tag">Meditate</span>
                                    <span className="habit-tag">Plan meals</span>
                                    <span className="habit-tag">Water plants</span>
                                    <span className="habit-tag">Take vitamins</span>
                                    <span className="habit-tag">Meditate</span>
                                    <span className="habit-tag">Plan meals</span>
                                    <span className="habit-tag">Water plants</span>
                                    <span className="habit-tag">Take vitamins</span>
                                </div>
                            </div>

                            <div className="marquee">
                                <div className="marquee-content" style={{ animationDelay: '1s' }}>
                                    <span className="habit-tag">Call parents</span>
                                    <span className="habit-tag">Learn new skill</span>
                                    <span className="habit-tag">Drink water</span>
                                    <span className="habit-tag">Write diary</span>
                                    <span className="habit-tag">Call parents</span>
                                    <span className="habit-tag">Learn new skill</span>
                                    <span className="habit-tag">Drink water</span>
                                    <span className="habit-tag">Write diary</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="continue-btn" onClick={() => navigate('/todos')}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
