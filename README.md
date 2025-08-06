This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables by creating a `.env.local` file in the root directory:

```bash
# VAPI AI Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# OpenAI/OpenRouter Configuration
OPEN_ROUTER_API_KEY=your_openrouter_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Required API Keys

1. **VAPI API Key**: Get your API key from [VAPI AI](https://vapi.ai/)
2. **OpenRouter API Key**: Get your API key from [OpenRouter](https://openrouter.ai/)
3. **Clerk Keys**: Get your authentication keys from [Clerk](https://clerk.com/)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



 const StartCall = () => {
    
    // VAPI AI
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

    setVapiInstance(vapi);

    // const VapiAgentConfig = {
    //   name: "AI Medical Doctor Voice Agent",
    //   firstMessage:
    //     "Hi there! I'm your AI Medical Doctor Agent. I'm here to help you navigate your health questions with care and accuracy.Whether you're feeling unwell or just have a health question, I'm here to help.How can I support you today?",
    //   transcriber: {
    //     provider: "assembly-ai",
    //     language: "en",
    //   },
    //   voice: {
    //     provider: "playht",
    //     voiceId: sessionDetail?.selectedDoctor?.voiceId,
    //   },
    //   model: {
    //     provider: "openai",
    //     model: "gpt-4",
    //     messages: [
    //       {
    //         role: "system",
    //         content: sessionDetail?.selectedDoctor?.agentPrompt,
    //       },
    //     ],
    //   },
    // };
     
    // @ts-ignore
    // vapi.start(VapiAgentConfig);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID)

    // Start voice conversation

    // Listen for events
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      setCallStarted(false);
      console.log("Call ended");
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType == "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType == "final") {
          //  Final transcript
          setMessages((prev: any) => [
            ...prev,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
  };# mediecho
