import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { beatTitle, tier, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
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
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?success=true&beat=${encodeURIComponent(beatTitle)}`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      metadata: {
        beatTitle,
        tier,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
