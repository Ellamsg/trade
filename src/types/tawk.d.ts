// types/tawk.d.ts
declare global {
    interface Window {
      Tawk_API: {
        setAttributes: (attributes: Record<string, any>) => void;
        addEvent: (event: string, metadata?: Record<string, any>) => void;
        onLoad?: () => void;
        onChatStarted?: () => void;
        onChatEnded?: () => void;
        hideWidget?: () => void;
        showWidget?: () => void;
        toggle?: () => void;
        maximize?: () => void;
        minimize?: () => void;
        // Add other Tawk.to API methods as needed
      };
    }
  }
  
  export {};