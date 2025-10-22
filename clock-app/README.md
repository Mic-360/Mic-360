# Clock App with Lifecycle Management

A cross-platform clock application that demonstrates proper lifecycle management by automatically stopping when the app goes into the background and resuming when it comes back to the foreground.

## Features

- **Automatic Lifecycle Management**: Clock automatically stops/starts based on app visibility
- **Cross-Platform Support**: Works on web browsers (desktop and mobile)
- **Visual Feedback**: Real-time status indicator showing clock state
- **Event Logging**: Activity log showing all lifecycle events
- **Responsive Design**: Works on all screen sizes

## How It Works

The application uses the **Page Visibility API** to detect when the page becomes hidden or visible:

- **Background**: When you switch to another tab, minimize the browser, or the app loses focus
- **Foreground**: When you return to the tab or the app regains focus

### Implementation Details

The clock manager (`clock.js`) implements:

1. **Page Visibility API** - Primary method for detecting tab visibility changes
2. **Window blur/focus events** - Backup triggers for older browsers
3. **pagehide/pageshow events** - Additional support for mobile browsers

## Usage

### Running the Application

1. Open `index.html` in any modern web browser
2. The clock will start automatically
3. Switch to another tab or minimize the browser to see the clock stop
4. Return to the tab to see the clock resume

### Testing the Lifecycle Behavior

1. **Desktop**: Switch between tabs or minimize/restore the browser window
2. **Mobile**: Switch to another app or press the home button
3. Observe the status indicator and event logs

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari (Desktop): ✅ Full support
- Safari (iOS): ✅ Full support
- Opera: ✅ Full support

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `clock.js` - Clock manager with lifecycle management logic

## Platform Adaptation

While this implementation is for web, the same principles apply to native mobile apps:

- **Android**: Use `onPause()` and `onResume()` lifecycle methods
- **iOS**: Use `applicationDidEnterBackground` and `applicationWillEnterForeground` notifications
- **Flutter**: Use `AppLifecycleState` with `WidgetsBindingObserver`
- **React Native**: Use `AppState` API

## Key Concepts

### Background State
- Tab is hidden (switched to another tab)
- Browser is minimized
- Device screen is locked (mobile)
- App is sent to background (mobile)

### Foreground State
- Tab becomes visible
- Browser is restored
- Device screen is unlocked
- App returns to foreground

## Performance Benefits

By stopping the clock when in the background, this implementation:
- Reduces CPU usage when the app isn't visible
- Saves battery life on mobile devices
- Prevents unnecessary updates to hidden UI elements
- Follows best practices for web and mobile applications

## License

This is a demonstration project for lifecycle management in applications.
