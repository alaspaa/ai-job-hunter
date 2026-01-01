const { convert } = require('html-to-text');

const WEBSITE_SELECTORS: Map<string, { selectors: string[] }> = new Map([
        ['DUUNITORI', { selectors: [ '#main-content', '.description-box' ] }],
        ['LINKEDIN', { selectors: [ '.job-details-jobs-unified-top-card__container--two-pane', '.jobs-description' ] }],
])

const DEFAULT_SELECTORS = { selectors: [ 'body' ] }

export default async function extractTextFromUrl(
        url: string,
        website: string | null = null,
): Promise<string> {
        const selectors = website ? WEBSITE_SELECTORS.get(website.toUpperCase()) : DEFAULT_SELECTORS
        if(!selectors) {
                throw new Error(`Unsupported website: ${website}`);
        }

        const fetchResult = await fetch(url);
        if(!fetchResult.ok) {
                throw new Error(`Failed to fetch URL: ${url}`);
        }

        const responseBody = await fetchResult.text();
        
        const options = {
                wordwrap: 130,
                baseElements: selectors,
        }; 

        return convert(responseBody, options);
}