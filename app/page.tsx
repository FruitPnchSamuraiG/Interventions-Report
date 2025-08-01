"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExternalLink, Search, Filter, X } from "lucide-react"

interface Intervention {
  type: string
  description: string
  focus: string
  driver: string
  userJourney: string
  scope: string
  considerations: string
  tradeoffs: string
  platform: string
  intention: string
  references: string
}

const interventions: Intervention[] = [
  {
    type: "Private Profiles",
    description: "A setting that allows account owners to restrict access to their content.",
    focus: "Virality",
    driver: "User",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Offers control but contributes to filter bubbles",
    tradeoffs: "Isolation vs. control",
    platform: "Twitter",
    intention: "Prepare",
    references:
      "https://help.twitter.com/en/safety-and-security/public-and-protected-posts, https://help.instagram.com/517073653436611",
  },
  {
    type: "Slowed Virality",
    description: "Friction like confirmation screens to slow unwitting sharing",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Friction can annoy but also promote deliberation",
    tradeoffs: "Friction vs. deliberation",
    platform: "Twitter, Facebook",
    intention: "Curb",
    references: "",
  },
  {
    type: "Removal",
    description:
      "The complete deletion of unwanted content that violates platform or regional consumer safety policies.",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Promotes safety but risks perceived over-censorship",
    tradeoffs: "Censorship vs. safety",
    platform: "Facebook, Twitter, Reddit",
    intention: "Curb",
    references: "",
  },
  {
    type: "Suspensions",
    description: "Platforms temporarily ban consumers who violate their terms and conditions.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Increases safety but risks perceived censorship",
    tradeoffs: "Safety vs. censorship",
    platform: "YouTube, Twitter, Instagram",
    intention: "Response",
    references:
      "https://support.google.com/youtube/answer/10834785?hl=en, https://help.twitter.com/en/rules-and-policies/notices-on-x, https://help.instagram.com/384216631681668",
  },
  {
    type: "Community Rules",
    description:
      "Behavioral and ethical standards that are set and maintained by consumers who define guidelines for discourse.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Enables autonomy but risks fragmenting shared spaces",
    tradeoffs: "Fragmentation vs. autonomy",
    platform: "Reddit, Discord",
    intention: "",
    references: "https://www.facebook.com/communitystandards/",
  },
  {
    type: "Crowd Reporting",
    description:
      "Buttons that enable consumers to manually flag and report potentially violating content for the platform to review.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Catch violations but enables harassment campaigns",
    tradeoffs: "Harassment vs. policing",
    platform: "YouTube",
    intention: "",
    references: "https://support.google.com/youtube/answer/2802027?hl=en",
  },
  {
    type: "Community Notes",
    description:
      "Notes or comments that users post under content to offer contextual info to the posts' integrity or message.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Harnesses collective knowledge but risks coordinated misuse and manipulation",
    tradeoffs: "Crowd wisdom vs. crowdsourcing harassment",
    platform: "Reddit",
    intention: "",
    references: "",
  },
  {
    type: "Demonetization",
    description: "Platforms remove the potential for consumers to receive compensation for the content they upload.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Deters violations but impacts content creator revenue",
    tradeoffs: "Revenue loss vs. deterrence",
    platform: "YouTube, Twitter, Facebook, Instagram",
    intention: "Response",
    references:
      "https://support.google.com/youtube/answer/1311392?hl=en, https://help.twitter.com/en/rules-and-policies/content-monetization-standards, https://www.facebook.com/help/instagram/512371932629820, https://help.instagram.com/2635536099905516",
  },
  {
    type: "Identity Verification",
    description:
      "Features that require consumers to submit identifying documents to create accounts to participate in an online community.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Adds accountability but creates barrier to access",
    tradeoffs: "Barrier to entry vs. accountability",
    platform: "",
    intention: "Prepare",
    references: "https://www.tandfonline.com/doi/full/10.1080/07421222.2021.1990615",
  },
  {
    type: "Nudging",
    description:
      "Automated messages, pop-up text, and other design features that aim to equip consumers to make healthy and informed choices to better themselves and other consumers.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Can guide choices but risks manipulative paternalism",
    tradeoffs: "Manipulation vs. guidance",
    platform: "Twitter",
    intention: "Prepare",
    references: "https://arxiv.org/abs/2112.00773, https://www.atlantis-press.com/proceedings/icest-19/125945421",
  },
  {
    type: "Prompts",
    description: "Automated messages show to consumers cautioning against toxic content or unwanted behaviors.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Can encourage reflection but risks annoying users",
    tradeoffs: "Annoyance vs. self reflection",
    platform: "Facebook",
    intention: "Prepare",
    references: "",
  },
  {
    type: "Public Service Announcements (PSAs)",
    description:
      "Educational messages or pop-up text that shares trusted sources to readers who can learn fact-check information, government safety announcements, or the sources of research information to combat misinformation, disinformation, or any content that would benefit from additional footnotes.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Raises awareness but risks message fatigue",
    tradeoffs: "Awareness vs. message fatigue",
    platform: "YouTube",
    intention: "Prepare",
    references: "https://www.cnn.com/2022/01/12/tech/youtube-fact-checkers-letter/index.html",
  },
  {
    type: "Labeling",
    description:
      "Short disclaimers about questionable or unwanted content to help users make healthy choices, which include but are not limited to fact-checking labels, warning labels, dispute labels, or AI labels.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Promoting verified information while risking being over prescriptive to consumer behavior",
    tradeoffs: "Trusted sources vs. over prescriptive",
    platform: "Facebook, Twitter, Reddit",
    intention: "",
    references: "https://transparency.fb.com/mr-in/features/how-fact-checking-works/",
  },
  {
    type: "Sponsor Labels",
    description:
      "Unique labels are paired with content that contains paid content that is promoted by an individual consumer or a third-party company working with the consumer.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Increases transparency but impacts sponsored content visibility",
    tradeoffs: "Visibility vs. revenue loss",
    platform: "Twitter, Facebook",
    intention: "",
    references:
      "https://help.instagram.com/116947042301556, https://support.google.com/youtube/answer/154235?hl=en, https://www.facebook.com/business/help/221149188908254",
  },
  {
    type: "Prebunks",
    description:
      "Purposely exposing consumers to anticipated misinformation narratives and techniques so they are equipped with the knowledge needed to spot future misinformation and disinformation content.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Inoculates against misinfo but paternalistically assumes susceptibility",
    tradeoffs: "Paternalism vs. inoculation",
    platform: "Facebook",
    intention: "Prepare",
    references:
      "https://www.tandfonline.com/doi/abs/10.1080/10463283.2021.1876983, https://prebunking.withgoogle.com/docs/A_Practical_Guide_to_Prebunking_Misinformation.pdf",
  },
  {
    type: "Reverse Chronological",
    description:
      "Feed rankings designed to show users the most recent post rather than algorithmically sorted content aimed to drive high engagement.",
    focus: "Appearance",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Shows most recent but hides potentially relevant content",
    tradeoffs: "Recency vs. relevance",
    platform: "Twitter",
    intention: "",
    references:
      "https://www.techtimes.com/articles/278322/20220721/facebook-launches-feed-lets-see-posts-reverse-chronological-order.htm",
  },
  {
    type: "Community Moderators",
    description:
      "User-driven enforcement of rules such as banning, inviting, and suspending from digital communities on platforms.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Leverages localized judgment but risks bias",
    tradeoffs: "Bias vs. localized judgment",
    platform: "Reddit",
    intention: "",
    references:
      "https://www.redditinc.com/policies/moderator-code-of-conduct, https://discord.com/safety/360044103531-role-of-administrators-and-moderators-on-discord",
  },
  {
    type: "Restricted Recommendations",
    description:
      "Harmful content detected through user reports or AI can be limited from user's algorithms or inboxes.",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Allows oversight but risks opaque censorship",
    tradeoffs: "Oversight vs. opacity",
    platform: "YouTube, Facebook",
    intention: "",
    references:
      "https://support.google.com/youtube/answer/7354993?hl=en, https://www.belfercenter.org/sites/default/files/files/publication/Social%20Media%20Recommendation%20Algorithms%20Tech%20Primer.pdf, https://about.fb.com/news/2024/01/teen-protections-age-appropriate-experiences-on-our-apps/",
  },
  {
    type: "Muting",
    description: "A feature that enables users to limit the content they see on their algorithms or inboxes.",
    focus: "Appearance",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Empowers consumers but risk lack of accessibility",
    tradeoffs: "TBD",
    platform: "",
    intention: "",
    references: "",
  },
  {
    type: "Age-restricted Content",
    description: "All shared content is filtered to show age-appropriate themes to users under 18 years old.",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Risk inappropriate content being share to minors if parents cannot enforce safety measure",
    tradeoffs: "TBD",
    platform: "YouTube",
    intention: "",
    references: "https://support.google.com/youtube/answer/2802167",
  },
  {
    type: "Forwarding Limits",
    description: "Limitations on how many times messages can be forwarded and shared with other users.",
    focus: "Behavior",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Slows virality but risks inconveniencing good faith users",
    tradeoffs: "Viral spread vs. inconvenience for good faith users",
    platform: "WhatsApp, Facebook",
    intention: "",
    references:
      "https://faq.whatsapp.com/1053543185312573, https://about.fb.com/news/2020/09/introducing-a-forwarding-limit-on-messenger/",
  },
  {
    type: "Downvoting",
    description:
      "A tool that allows users to demote or vote for content they do not want to see, allowing crowd-sourced needs to be amplified to online safety professionals.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Aggregates opinions but risks mob behavior",
    tradeoffs: "Brigading vs. crowd wisdom",
    platform: "Facebook, YouTube, Reddit",
    intention: "",
    references:
      "https://www.socialmediatoday.com/news/facebook-tests-updated-up-and-downvoting-for-comments-in-groups/598096/, https://support.google.com/youtube/thread/134791097/update-to-youtube-dislike-counts?hl=en, https://support.reddithelp.com/hc/en-us/articles/360043071072-Do-not-threaten-harass-or-bully, https://arxiv.org/pdf/2302.09540.pdf",
  },
  {
    type: "Downranking",
    description:
      "Platforms adjust their algorithms to reduce the visibility or prominence of certain content or accounts.",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Allows oversight but risks opaque censorship",
    tradeoffs: "Oversight vs. opacity",
    platform: "",
    intention: "",
    references:
      "https://dl.acm.org/doi/abs/10.1145/3313831.3376232, https://foundation.mozilla.org/en/campaigns/trained-for-deception-how-artificial-intelligence-fuels-online-disinformation/ranking-and-recommendation-systems/, https://rtau.blog.gov.uk/2021/08/05/the-use-of-algorithms-in-the-content-moderation-process/, https://journals.sagepub.com/doi/10.1177/2053951719897945",
  },
  {
    type: "Collapsed Comments",
    description:
      "An added design feature that allows comments, both wanted and unwanted, to be displayed in accordions that organize commentary for users to sort through in order to view.",
    focus: "Appearance",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Reduces clutter but risks suppressing minority opinions",
    tradeoffs: "Clutter vs. suppression",
    platform: "Reddit",
    intention: "",
    references: "https://support.reddithelp.com/hc/en-us/articles/15484545006996-Crowd-Control",
  },
  {
    type: "Filtered Comments",
    description:
      "The editorial decision to auto-filter potentially offensive replies to a consumer's post or publication into a separate accordion, altering the appearance of the user-to-user interaction.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Mitigates abuse but risks incorrectly filtering benign replies",
    tradeoffs: "False positives vs. safety",
    platform: "Twitter",
    intention: "",
    references:
      "https://help.twitter.com/en/managing-your-account/understanding-the-notifications-timeline, https://www.socialmediatoday.com/news/twitter-experiments-with-reply-filters-timeline-controls-and-the-capacity/641891/",
  },
  {
    type: "Hidden Comments",
    description:
      "Comments that are made invisible or shown under a separated accordion based on both the platform's standards and the consumer's standards which are expressed in the settings.",
    focus: "Appearance",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Upholds decorum but enables covert censorship",
    tradeoffs: "Censorship vs. decorum",
    platform: "Facebook, YouTube",
    intention: "",
    references: "https://www.facebook.com/business/help/1323914937703529",
  },
  {
    type: "Message Requests",
    description:
      "A process that filters Direct Messages (DMs) from unknown senders and shows the consumer on a page different from their standard inbox.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Adds safety friction but annoys legitimate users",
    tradeoffs: "Friction vs. safety",
    platform: "Instagram",
    intention: "Prepare",
    references:
      "https://about.instagram.com/blog/announcements/introducing-new-tools-to-protect-our-community-from-abuse",
  },
  {
    type: "Community Bans",
    description:
      "A system established by community moderators to prohibit the formation of consumers around certain topics.",
    focus: "Virality",
    driver: "User",
    userJourney: "Proactive",
    scope: "Targeted",
    considerations: "Limits harm but perceived as censorship",
    tradeoffs: "Censorship vs. safety",
    platform: "Reddit",
    intention: "",
    references: "https://www.redditinc.com/policies/content-policy",
  },
  {
    type: "Keyword Flagging",
    description:
      "An automated system where unwanted words or phrases get flagged for content removal, labeling, or suspension.",
    focus: "Virality",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "Efficient but prone to over-pruning or editing content",
    tradeoffs: "Overblocking vs. automation",
    platform: "Facebook",
    intention: "",
    references: "",
  },
  {
    type: "Blurred Content",
    description: "A visual filter that alters and obscures content including images, text, or video.",
    focus: "Appearance",
    driver: "Platform",
    userJourney: "Retroactive",
    scope: "Targeted",
    considerations: "Balances context and sensitivity but opaque",
    tradeoffs: "Context vs. sensitivity",
    platform: "Twitter",
    intention: "",
    references: "https://about.instagram.com/blog/announcements/updates-to-the-sensitive-content-control",
  },
  {
    type: "Content Filters",
    description:
      "A feature that allows users to customize the content they are exposed to through settings that offer customization to blocked or limited keywords, phrases, other users, accounts, or channels.",
    focus: "Behavior",
    driver: "User",
    userJourney: "Proactive",
    scope: "Systemic",
    considerations: "Gives control but enables creating echo chambers",
    tradeoffs: "Echo chambers vs. control",
    platform: "Twitter",
    intention: "Curb/Respond",
    references: "https://help.instagram.com/1055538028699165",
  },
  {
    type: "Parental Controls",
    description: "",
    focus: "Appearance",
    driver: "User",
    userJourney: "Retroactive",
    scope: "Systemic",
    considerations: "",
    tradeoffs: "",
    platform: "",
    intention: "",
    references: "",
  },
]

const getColorForCategory = (category: string, value: string) => {
  const colorMap: { [key: string]: { [value: string]: string } } = {
    focus: {
      Virality: "bg-red-100 text-red-800 border-red-200",
      Behavior: "bg-blue-100 text-blue-800 border-blue-200",
      Appearance: "bg-green-100 text-green-800 border-green-200",
    },
    driver: {
      User: "bg-purple-100 text-purple-800 border-purple-200",
      Platform: "bg-orange-100 text-orange-800 border-orange-200",
    },
    userJourney: {
      Proactive: "bg-teal-100 text-teal-800 border-teal-200",
      Retroactive: "bg-pink-100 text-pink-800 border-pink-200",
    },
    scope: {
      Systemic: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Targeted: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
  }
  return colorMap[category]?.[value] || "bg-gray-100 text-gray-800 border-gray-200"
}

export default function PlatformInterventionsTaxonomy() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    focus: [],
    driver: [],
    userJourney: [],
    scope: [],
    platform: [],
  })

  // Get unique values for each filter category
  const filterOptions = useMemo(() => {
    const options: { [key: string]: string[] } = {}
    const keys = ["focus", "driver", "userJourney", "scope", "platform"]

    keys.forEach((key) => {
      const values = new Set<string>()
      interventions.forEach((intervention) => {
        const value = intervention[key as keyof Intervention]
        if (value && value.trim()) {
          if (key === "platform") {
            // Split platform values by comma and add each one
            value.split(",").forEach((p) => values.add(p.trim()))
          } else {
            values.add(value.trim())
          }
        }
      })
      options[key] = Array.from(values).sort()
    })

    return options
  }, [])

  // Filter interventions based on search and selected filters
  const filteredInterventions = useMemo(() => {
    return interventions.filter((intervention) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          intervention.type.toLowerCase().includes(searchLower) ||
          intervention.description.toLowerCase().includes(searchLower) ||
          intervention.considerations.toLowerCase().includes(searchLower) ||
          intervention.tradeoffs.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Category filters
      for (const [filterKey, selectedValues] of Object.entries(selectedFilters)) {
        if (selectedValues.length > 0) {
          const interventionValue = intervention[filterKey as keyof Intervention]
          if (!interventionValue) return false

          if (filterKey === "platform") {
            // For platforms, check if any selected platform is included
            const platforms = interventionValue.split(",").map((p) => p.trim())
            const hasMatch = selectedValues.some((selected) => platforms.some((platform) => platform === selected))
            if (!hasMatch) return false
          } else {
            if (!selectedValues.includes(interventionValue.trim())) return false
          }
        }
      }

      return true
    })
  }, [searchTerm, selectedFilters])

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: checked ? [...prev[category], value] : prev[category].filter((v) => v !== value),
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      focus: [],
      driver: [],
      userJourney: [],
      scope: [],
      platform: [],
    })
    setSearchTerm("")
  }

  const activeFilterCount = Object.values(selectedFilters).flat().length

  const parseReferences = (references: string) => {
    if (!references.trim()) return []

    const formatReference = (url: string) => {
      const cleanUrl = url.trim()

      // Academic papers - use generic descriptors since I cannot access the actual papers
      if (cleanUrl.includes("arxiv.org")) {
        if (cleanUrl.includes("2112.00773")) return "arXiv:2112.00773, 2021"
        if (cleanUrl.includes("2302.09540")) return "arXiv:2302.09540, 2023"
        return "arXiv Paper"
      }

      if (cleanUrl.includes("tandfonline.com")) {
        if (cleanUrl.includes("07421222.2021.1990615")) return "Taylor & Francis, 2021"
        if (cleanUrl.includes("10463283.2021.1876983")) return "Taylor & Francis, 2021"
        return "Taylor & Francis"
      }

      if (cleanUrl.includes("atlantis-press.com")) {
        if (cleanUrl.includes("icest-19")) return "ICEST Conference, 2019"
        return "Atlantis Press"
      }

      if (cleanUrl.includes("dl.acm.org")) {
        if (cleanUrl.includes("3313831.3376232")) return "ACM CHI, 2020"
        return "ACM Digital Library"
      }

      if (cleanUrl.includes("sagepub.com")) {
        if (cleanUrl.includes("2053951719897945")) return "Big Data & Society, 2019"
        return "SAGE Journals"
      }

      if (cleanUrl.includes("belfercenter.org")) return "Belfer Center, Harvard"
      if (cleanUrl.includes("mozilla.org")) return "Mozilla Foundation"
      if (cleanUrl.includes("rtau.blog.gov.uk")) return "UK Government, 2021"
      if (cleanUrl.includes("prebunking.withgoogle.com")) return "Google Jigsaw"

      // Platform help pages and blogs
      if (cleanUrl.includes("help.twitter.com") || cleanUrl.includes("twitter.com")) return "X (Twitter) Help"
      if (cleanUrl.includes("help.instagram.com") || cleanUrl.includes("instagram.com")) return "Meta (Instagram) Help"
      if (
        cleanUrl.includes("facebook.com") ||
        cleanUrl.includes("transparency.fb.com") ||
        cleanUrl.includes("about.fb.com")
      ) {
        if (cleanUrl.includes("transparency.fb.com")) return "Meta Transparency Center"
        if (cleanUrl.includes("about.fb.com")) return "Meta Newsroom"
        return "Meta (Facebook) Help"
      }
      if (cleanUrl.includes("support.google.com/youtube")) return "YouTube Help Center"
      if (cleanUrl.includes("faq.whatsapp.com")) return "WhatsApp FAQ"
      if (cleanUrl.includes("redditinc.com")) return "Reddit Inc."
      if (cleanUrl.includes("reddithelp.com")) return "Reddit Help"
      if (cleanUrl.includes("discord.com")) return "Discord Safety"
      if (cleanUrl.includes("cnn.com")) return "CNN, 2022"
      if (cleanUrl.includes("techtimes.com")) return "Tech Times, 2022"
      if (cleanUrl.includes("socialmediatoday.com")) return "Social Media Today"

      // Default fallback
      return "External Source"
    }

    return references
      .split(",")
      .map((ref) => ({
        url: ref.trim(),
        citation: formatReference(ref.trim()),
      }))
      .filter((ref) => ref.url.length > 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Platform Interventions Taxonomy</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A comprehensive classification system for understanding and analyzing various intervention mechanisms
              employed by social media platforms to moderate content, behavior, and user experiences.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear ({activeFilterCount})
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Interventions
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Categories */}
              <Accordion type="multiple" defaultValue={["focus", "driver"]} className="w-full">
                {Object.entries(filterOptions).map(([category, options]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-sm font-medium text-gray-700 capitalize">
                      {category === "userJourney" ? "User Journey" : category}
                      {selectedFilters[category].length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {selectedFilters[category].length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${category}-${option}`}
                              checked={selectedFilters[category].includes(option)}
                              onCheckedChange={(checked) => handleFilterChange(category, option, checked as boolean)}
                            />
                            <Label
                              htmlFor={`${category}-${option}`}
                              className={`text-sm cursor-pointer px-2 py-1 rounded ${
                                selectedFilters[category].includes(option)
                                  ? getColorForCategory(category, option)
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Interventions ({filteredInterventions.length})</h2>
              </div>
            </div>

            <div className="space-y-6">
              {filteredInterventions.map((intervention, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{intervention.type}</CardTitle>
                        <CardDescription className="text-gray-600 text-base leading-relaxed">
                          {intervention.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Focus:</span>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${getColorForCategory("focus", intervention.focus)}`}
                          >
                            {intervention.focus}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Driver:</span>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${getColorForCategory("driver", intervention.driver)}`}
                          >
                            {intervention.driver}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">User Journey:</span>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${getColorForCategory("userJourney", intervention.userJourney)}`}
                          >
                            {intervention.userJourney}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Scope:</span>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${getColorForCategory("scope", intervention.scope)}`}
                          >
                            {intervention.scope}
                          </Badge>
                        </div>
                        {intervention.platform && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Platform:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {intervention.platform.split(",").map((platform, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {platform.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {intervention.considerations && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Considerations:</span>
                        <p className="text-sm text-gray-600 mt-1">{intervention.considerations}</p>
                      </div>
                    )}

                    {intervention.tradeoffs && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Tradeoffs:</span>
                        <p className="text-sm text-gray-600 mt-1">{intervention.tradeoffs}</p>
                      </div>
                    )}

                    {intervention.references && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 mb-2 block">References:</span>
                        <div className="flex flex-wrap gap-2">
                          {parseReferences(intervention.references).map((ref, idx) => (
                            <a
                              key={idx}
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {ref.citation}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredInterventions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No interventions found</h3>
                  <p className="text-sm">Try adjusting your search terms or filters</p>
                </div>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
