export type DocGuide = { title: string; description: string; sections: { heading: string; body: string[]; steps?: string[] }[] };

export const guides: Record<string, DocGuide> = {
  'google-merchant': {
    title: 'Google Merchant Center feed setup', description: 'Generate, validate and connect the WooFeeds Pro RSS XML feed to Google Merchant Center.',
    sections: [
      { heading: 'Prepare the catalog', body: ['Map brand, GTIN and MPN from the WooCommerce fields or attributes already used by the store. Add a Google product category when it is known.'], steps: ['Open WooCommerce → WooFeeds Pro → Field Mapping.', 'Choose the source for brand, GTIN and MPN.', 'Run validation and correct important missing fields.'] },
      { heading: 'Generate the Google feed', body: ['Enable Google Merchant, choose the target country and regenerate the feed. WooFeeds Pro publishes a completed RSS 2.0 XML snapshot at a stable URL.'] },
      { heading: 'Connect Merchant Center', body: ['Create a scheduled data source in Merchant Center and paste the Google feed URL. Match Google’s fetch schedule to the refresh interval selected in WooFeeds Pro.'] },
    ],
  },
  'meta-commerce': {
    title: 'Meta Commerce catalog setup', description: 'Connect WooFeeds Pro to a Meta Commerce Manager catalog with a scheduled data source.',
    sections: [
      { heading: 'Map Meta-ready fields', body: ['Use stable product IDs, absolute HTTPS links, current prices, images and accurate availability. Add Google and Facebook product categories where useful.'] },
      { heading: 'Publish the Meta feed', body: ['Enable Meta Commerce and generate the catalog XML. Variable products can be exported as separate items while sharing a product group.'] },
      { heading: 'Schedule the catalog', body: ['In Commerce Manager, choose a data feed as the source, paste the hosted Meta URL and schedule recurring updates.'] },
    ],
  },
  chatgpt: {
    title: 'ChatGPT product feed setup', description: 'Configure and publish the WooFeeds Pro compressed JSONL product feed for ChatGPT commerce.',
    sections: [
      { heading: 'Configure seller details', body: ['Enter the seller name, target countries and required catalog mappings. Keep product URLs and image URLs publicly reachable over HTTPS.'] },
      { heading: 'Generate JSONL.gz', body: ['WooFeeds Pro writes one normalized product object per line, then compresses the completed catalog with gzip.'] },
      { heading: 'Validate before submission', body: ['Review the plain-language validation report for missing titles, prices, images, availability, identifiers and country targeting.'] },
    ],
  },
  licensing: {
    title: 'Licensing and domain migration', description: 'Activate a domain-locked WooFeeds Pro license and move it safely between stores.',
    sections: [
      { heading: 'Activate once', body: ['The first successful activation locks the license to the normalized store domain. A key cannot activate on a second domain while the original activation remains active.'] },
      { heading: 'Offline grace', body: ['License validation is cached. A temporary licensing-service outage can enter the configured grace period without deleting completed feed files.'] },
      { heading: 'Move a store', body: ['Deactivate the license on the old domain, complete the migration, then activate the same key on the new domain.'] },
    ],
  },
  troubleshooting: {
    title: 'Troubleshooting WooFeeds Pro', description: 'Fix common feed generation, mapping, cron, licensing and channel-import problems.',
    sections: [
      { heading: 'Feed is not refreshing', body: ['Check the last-run time on the dashboard. If WordPress traffic is low or WP-Cron is disabled, run the WooFeeds WP-CLI command from a real server cron.'] },
      { heading: 'Products are missing identifiers', body: ['Confirm the GTIN, MPN and brand mappings. The validator reports exactly how many catalog items are affected.'] },
      { heading: 'Channel rejects an image', body: ['Use an absolute HTTPS image URL that is publicly reachable and not blocked by authentication or robots rules.'] },
      { heading: 'License shows another domain', body: ['Deactivate the previous domain before activating on the new one. Contact support if the old store is no longer accessible.'] },
    ],
  },
};

