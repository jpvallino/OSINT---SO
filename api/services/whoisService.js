import axios from 'axios';

const RDAP_BASE = 'https://rdap.org';

/**
 * Perform RDAP/WHOIS lookup for a domain
 */
export async function lookupDomain(domain) {
  try {
    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      throw new Error('Invalid domain format');
    }

    const response = await axios.get(`${RDAP_BASE}/domain/${encodeURIComponent(domain)}`, {
      timeout: 15000,
      headers: { 'Accept': 'application/rdap+json' }
    });

    const data = response.data;

    return {
      domain: data.ldhName || domain,
      status: data.status || [],
      events: extractEvents(data.events),
      nameservers: extractNameservers(data.nameservers),
      entities: extractEntities(data.entities),
      links: data.links?.map(l => ({ rel: l.rel, href: l.href })) || [],
      rawObjectClassName: data.objectClassName,
      secureDNS: data.secureDNS || null
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { domain, error: 'Domain not found in RDAP registry', status: [] };
    }
    if (error.message === 'Invalid domain format') {
      throw error;
    }
    throw new Error(`RDAP lookup failed: ${error.message}`);
  }
}

/**
 * Lookup IP address via RDAP
 */
export async function lookupIP(ip) {
  try {
    const response = await axios.get(`${RDAP_BASE}/ip/${encodeURIComponent(ip)}`, {
      timeout: 15000,
      headers: { 'Accept': 'application/rdap+json' }
    });

    const data = response.data;

    return {
      ip: ip,
      name: data.name,
      type: data.type,
      startAddress: data.startAddress,
      endAddress: data.endAddress,
      country: data.country,
      events: extractEvents(data.events),
      entities: extractEntities(data.entities),
      status: data.status || []
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { ip, error: 'IP not found', status: [] };
    }
    throw new Error(`RDAP IP lookup failed: ${error.message}`);
  }
}

function extractEvents(events) {
  if (!events) return [];
  return events.map(e => ({
    action: e.eventAction,
    date: e.eventDate
  }));
}

function extractNameservers(nameservers) {
  if (!nameservers) return [];
  return nameservers.map(ns => ({
    name: ns.ldhName,
    ipAddresses: ns.ipAddresses || {}
  }));
}

function extractEntities(entities) {
  if (!entities) return [];
  return entities.map(entity => {
    const result = {
      roles: entity.roles || [],
      handle: entity.handle
    };

    // Extract vCard info if available
    if (entity.vcardArray && entity.vcardArray[1]) {
      const vcard = entity.vcardArray[1];
      for (const field of vcard) {
        if (field[0] === 'fn') result.name = field[3];
        if (field[0] === 'org') result.organization = field[3];
        if (field[0] === 'email') result.email = field[3];
        if (field[0] === 'adr') result.address = field[3];
      }
    }

    return result;
  });
}
