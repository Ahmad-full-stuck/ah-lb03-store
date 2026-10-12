import { useEffect, useState } from 'react'
import { readServerContent, readServerSettings } from '@/lib/api'

export const CONTENT_KEY = 'ah-lb03-admin-content'

export interface SiteContent {
  shopName: string
  phone: string
  whatsapp: string
  instagram: string
  announcementRight: string
  announcementLeft: string
  aboutTitle: string
  aboutText: string
  contactTitle: string
  contactText: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  heroNote: string
  heroNoteAlt: string
  statsTitle: string
  heroSlideMs: string
  categoriesEyebrow: string
  categoriesTitle: string
  newEyebrow: string
  newTitle: string
  newDesc: string
  guideEyebrow: string
  guideTitle: string
  guideText: string
  guideCta: string
  newsletterEyebrow: string
  newsletterTitle: string
  newsletterText: string
  promoPill: string
  promoLead: string
  promoText: string
  emailOrdersTo: string
  emailFromName: string
  emailFrom: string
  emailSubjectOrder: string
  emailTemplateOrder: string
  emailProvider: 'mailto' | 'formsubmit'
  emailFormSubmitAction: string
}

export const defaultSiteContent: SiteContent = {
  shopName: 'AH LB03',
  phone: '',
  whatsapp: '',
  instagram: 'https://www.instagram.com/ah_lb03/',
  announcementRight: 'شحن إلى جميع محافظات العراق',
  announcementLeft: 'ستريت وير أصلي 100%',
  aboutTitle: 'AH LB03 — ستريت وير يعبر عن هويتك',
  aboutText: 'AH LB03 علامة عراقية للستريت وير تقدم تيشيرتات وهوديات وأطقم عصرية بتصميمات أصلية. كل قطعة مختارة بعناية لتعكس أسلوبك وشخصيتك في الشارع العراقي.',
  contactTitle: 'سؤال عن منتج أو طلب؟',
  contactText: 'تواصل معنا لأي استفسار عن منتجات AH LB03 أو الطلبات. سنرد عليك في أقرب وقت ممكن.',
  heroEyebrow: 'ستريت وير عراقي أصلي',
  heroTitle: 'AH LB03|أسلوبك يبدأ من هنا',
  heroText: 'تيشيرتات، هوديات، وأطقم ستريت وير بتصميمات أصلية — أسلوبك يتحدث عنك.',
  heroNote: 'توصيل إلى جميع محافظات العراق',
  heroNoteAlt: 'دفع عند استلام الطلب',
  statsTitle: 'أرقامنا الآن',
  heroSlideMs: '2600',
  categoriesEyebrow: 'تصفح المجموعة',
  categoriesTitle: 'تيشيرتات، هوديات، أطقم',
  newEyebrow: 'وصل حديثاً',
  newTitle: 'أحدث المنتجات',
  newDesc: 'آخر ما أضفناه من منتجات رياضية',
  guideEyebrow: 'قبل الشراء',
  guideTitle: 'اختر المقاس|المناسب لأسلوبك',
  guideText: 'راجع جدول المقاسات في دليل المقاسات. إذا كنت بين مقاسين، اختر الأكبر لمزيد من الراحة.',
  guideCta: 'تصفح المنتجات',
  newsletterEyebrow: 'ابقَ على تواصل',
  newsletterTitle: 'اشتراك بالبريد',
  newsletterText: 'كن أول من يعرف عن التصميمات الجديدة والعروض الخاصة.',
  promoPill: 'توصيل لكل العراق',
  promoLead: 'توصيل مجاني',
  promoText: 'للطلبات فوق {price}',
  emailOrdersTo: 'gdumingm@gmail.com',
  emailFromName: 'AH LB03',
  emailFrom: '',
  emailSubjectOrder: 'طلب جديد من AH LB03 #{orderNumber}',
  emailTemplateOrder: '',
  emailProvider: 'formsubmit',
  emailFormSubmitAction: 'https://formsubmit.co/gdumingm@gmail.com',
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export const readSiteContent = (): SiteContent => ({
  ...defaultSiteContent,
  ...(readServerContent<Partial<SiteContent>>() || {}),
  ...readJson<Partial<SiteContent>>(CONTENT_KEY, {}),
})

export interface StoreSettings {
  colorsEnabled: boolean
  freeDeliveryFrom: number
  deliveryFee: number
  [key: string]: unknown
}

export const defaultStoreSettings: StoreSettings = {
  colorsEnabled: true,
  freeDeliveryFrom: 50000,
  deliveryFee: 5000,
}

export const readStoreSettings = (): StoreSettings => ({
  ...defaultStoreSettings,
  ...(readServerSettings() as Partial<StoreSettings>),
})

export const useStoreSettings = (): StoreSettings => {
  const [settings, setSettings] = useState<StoreSettings>(() => readStoreSettings())
  useEffect(() => {
    const sync = () => setSettings(readStoreSettings())
    window.addEventListener('eva-admin-changed', sync)
    return () => window.removeEventListener('eva-admin-changed', sync)
  }, [])
  return settings
}

const listeners = new Set<() => void>()

export const useSiteContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(() => readSiteContent())
  useEffect(() => {
    const sync = () => setContent(readSiteContent())
    listeners.add(sync)
    window.addEventListener('eva-admin-changed', sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener('eva-admin-changed', sync)
    }
  }, [])
  return content
}

export const contentLines = (value: string): string[] =>
  value.split('|').map((line) => line.trim()).filter(Boolean)

export const contentParts = (value: string): string[] => value.split('*')
