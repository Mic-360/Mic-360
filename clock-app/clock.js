/**
 * Clock Manager - Manages clock behavior based on application lifecycle
 * 
 * This implementation uses the Page Visibility API to detect when the
 * application goes into background (tab hidden) or foreground (tab visible).
 * The clock automatically stops when hidden and resumes when visible.
 */

class ClockManager {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.seconds = 0;
        this.clockElement = document.getElementById('clock');
        this.statusElement = document.getElementById('status');
        this.logsElement = document.getElementById('logs');
        
        this.init();
    }

    /**
     * Initialize the clock manager and set up lifecycle listeners
     */
    init() {
        this.addLog('Clock Manager initialized');
        this.setupLifecycleListeners();
        this.startClock();
    }

    /**
     * Set up listeners for app lifecycle changes
     * Uses Page Visibility API which is supported across all modern browsers
     */
    setupLifecycleListeners() {
        // Page Visibility API - Standard way to detect tab visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onBackground();
            } else {
                this.onForeground();
            }
        });

        // Additional listeners for mobile Safari and older browsers
        window.addEventListener('blur', () => {
            if (!document.hidden) {
                this.addLog('Window blur detected (backup trigger)');
            }
        });

        window.addEventListener('focus', () => {
            if (!document.hidden) {
                this.addLog('Window focus detected (backup trigger)');
            }
        });

        // Pagehide/pageshow for mobile compatibility
        window.addEventListener('pagehide', () => {
            this.onBackground();
        });

        window.addEventListener('pageshow', (event) => {
            if (!event.persisted) {
                this.onForeground();
            }
        });

        this.addLog('Lifecycle listeners registered');
    }

    /**
     * Called when app goes to background
     */
    onBackground() {
        this.addLog('App went to BACKGROUND', 'background');
        this.stopClock();
        this.updateStatus(false);
    }

    /**
     * Called when app comes to foreground
     */
    onForeground() {
        this.addLog('App came to FOREGROUND', 'foreground');
        this.startClock();
        this.updateStatus(true);
    }

    /**
     * Start the clock
     */
    startClock() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
        }, 1000);

        this.addLog('Clock STARTED');
    }

    /**
     * Stop the clock
     */
    stopClock() {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.addLog('Clock STOPPED');
    }

    /**
     * Update the clock display
     */
    updateDisplay() {
        const hours = Math.floor(this.seconds / 3600);
        const minutes = Math.floor((this.seconds % 3600) / 60);
        const secs = this.seconds % 60;

        const timeString = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');

        this.clockElement.textContent = timeString;
    }

    /**
     * Update status indicator
     */
    updateStatus(running) {
        if (running) {
            this.statusElement.textContent = 'Clock is running';
            this.statusElement.className = 'status running';
        } else {
            this.statusElement.textContent = 'Clock is stopped';
            this.statusElement.className = 'status stopped';
        }
    }

    /**
     * Add a log entry
     */
    addLog(message, type = 'info') {
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="event">${message}</span>
        `;

        this.logsElement.insertBefore(logEntry, this.logsElement.firstChild);

        // Keep only last 10 logs
        while (this.logsElement.children.length > 10) {
            this.logsElement.removeChild(this.logsElement.lastChild);
        }

        console.log(`[ClockManager] ${timestamp} - ${message}`);
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopClock();
        this.addLog('Clock Manager destroyed');
    }
}

// Initialize the clock manager when the page loads
let clockManager;

window.addEventListener('DOMContentLoaded', () => {
    clockManager = new ClockManager();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (clockManager) {
        clockManager.destroy();
    }
});
