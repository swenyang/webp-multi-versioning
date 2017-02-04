import React from 'react'
import styles from './App.css'

const App = props => (
    <div>
        {
            window.isWebPSupported ?
                <h1 className={styles.green}>
                    Your Browser Supports WebP
                </h1> :
                <h1 className={styles.red}>
                    {'Your Browser Doesn\'t Support WebP'}
                </h1>
        }
        <p className={styles.cyan}>img tag uses WebP image if supported:</p>
        <img alt="webp-fire-breathing" src={require('../images/fire-breathing.png')} />
        <hr />
        <p className={styles.webp}>CSS uses WebP image if supported:</p>
    </div>
)

export default App
