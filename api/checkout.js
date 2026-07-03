import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { beatTitle, tier, price, product, productName, productDesc } = req.body;

  try {
    let line_items, success_url, cancel_url, metadata;

    if (product) {
      // ---- Digital product flow (e.g. The Discipline Blueprint guide) ----
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName || 'Digital Product',
              description: productDesc || '',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ];
      success_url = `${req.headers.origin}/?success=true&product=${encodeURIComponent(product)}`;
      cancel_url = `${req.headers.origin}/?canceled=true`;
      metadata = { product };
    } else {
      // ---- Beat licensing flow (unchanged) ----
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${beatTitle} — ${tier.toUpperCase()} LICENSE`,
              description: tier === 'lease'
                ? 'MP3 Tagged · Non-Exclusive · Up to 5,000 streams'
                : 'WAV Untagged · Full Exclusivity · Unlimited streams · Stems included',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ];
      success_url = `${req.headers.origin}/?success=true&beat=${encodeURIComponent(beatTitle)}`;
      cancel_url = `${req.headers.origin}/?canceled=true`;
      metadata = { beatTitle, tier };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      metadata,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
