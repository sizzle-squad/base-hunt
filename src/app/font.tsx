import { Inter } from 'next/font/google';
import localFont from 'next/font/local'

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const coinbaseText = localFont({
  variable: '--font-coinbase-text',
  src: [
    {
      path: '../../public/fonts/Coinbase_Text-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Text-Regular_Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Coinbase_Text-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Text-Medium_Italic.woff2',
      weight: '500',
      style: 'italic',
    },
  ],
})

export const coinbaseSans = localFont({
  variable: '--font-coinbase-sans',
  src: [
    {
      path: '../../public/fonts/Coinbase_Sans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Sans-Regular_Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Coinbase_Sans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Sans-Medium_Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Coinbase_Sans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const coinbaseMono = localFont({
  variable: '--font-coinbase-mono',
  src: [
    {
      path: '../../public/fonts/Coinbase_Mono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Mono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
})

export const coinbaseDisplay = localFont({
  variable: '--font-coinbase-display',
  src: [
    {
      path: '../../public/fonts/Coinbase_Display-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Coinbase_Display-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
})