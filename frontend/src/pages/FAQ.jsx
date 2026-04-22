import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'Orders & Payments',
      questions: [
        {
          question: 'How do I place an order on ShopFusion?',
          answer: 'Simply browse our collection, add desired items to your cart, and proceed to checkout. You can pay using credit/debit cards, UPI, net banking, or wallet options. Once confirmed, you\'ll receive an order confirmation via email and SMS.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards (Visa, Mastercard, Amex), debit cards, UPI payments, net banking, Paytm, and cash on delivery (COD) for orders below ₹50,000. All transactions are secured with 256-bit SSL encryption.'
        },
        {
          question: 'How can I track my order?',
          answer: 'You can track your order by logging into your account and visiting the "My Orders" section. Additionally, you\'ll receive SMS updates and email notifications at every stage - from order confirmation to shipment dispatch and delivery.'
        },
        {
          question: 'Can I modify or cancel my order after placing it?',
          answer: 'Yes, you can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been shipped yet. Contact our customer support immediately at support@shopfusion.com or call +91 98765 43210.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'What are the shipping charges?',
          answer: 'Shipping is FREE on all orders above ₹999. For orders below ₹999, a nominal shipping charge of ₹99 applies. Express delivery (same-day or next-day) is available in select cities at additional charges starting from ₹149.'
        },
        {
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 5-7 business days across India. Express delivery (2-3 business days) is available in metro cities. International delivery takes 10-15 business days depending on the destination country and customs clearance.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We ship to over 30 countries worldwide including USA, UK, Canada, Australia, UAE, Singapore, and more. International shipping rates and delivery times vary by location.'
        },
        {
          question: 'What if my package is lost or damaged?',
          answer: 'In rare cases of lost or damaged packages, please report the issue within 48 hours of expected delivery. Contact our support team with your order ID and photos of damage. We\'ll initiate a full refund or replacement immediately.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most products. Items must be unused, in original packaging, and in sellable condition. Some categories like innerwear, cosmetics, and personalized items are not eligible for return.'
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Go to "My Orders" > Select the order > Click "Return Item" > Choose reason > Schedule pickup. Our courier partner will collect the package within 2-3 business days. Refunds are processed within 5-7 business days after quality verification.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive and verify the returned product. The amount will be credited to your original payment method - credit cards take 7-10 business days, UPI takes 2-3 business days, and bank transfers take 3-5 business days.'
        },
        {
          question: 'Can I exchange a product instead of returning?',
          answer: 'Yes! We offer free size/color exchanges for the same product. Simply initiate an exchange request from your order details. If the replacement is of higher value, pay the difference.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" in the top right corner. Enter your name, email, and phone number. Verify your email via OTP sent to your inbox. That\'s it!'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Login" > "Forgot Password". Enter your registered email or phone. We\'ll send a password reset link to your email or OTP to your phone.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Absolutely! We use enterprise-grade security including 256-bit SSL encryption, PCI-DSS compliant payment processing, and regular security audits. We never share your data with third parties.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account > Go to "My Profile" > Edit details. You can update name, phone, address, and communication preferences.'
        }
      ]
    },
    {
      category: 'Products & Warranty',
      questions: [
        {
          question: 'Are all products authentic?',
          answer: 'Yes, 100%! We source directly from authorized brand distributors and official showrooms. Every product comes with original packaging, tags, and authenticity cards where applicable.'
        },
        {
          question: 'What warranty do products come with?',
          answer: 'Most electronics come with 1-year manufacturer warranty. Fashion and lifestyle products don\'t have warranty but are covered under our 30-day return policy.'
        },
        {
          question: 'How do I find my size?',
          answer: 'Each product page has a detailed Size Guide in the description. We recommend measuring yourself and comparing with the chart.'
        },
        {
          question: 'Can I get a product customized or personalized?',
          answer: 'Yes! We offer personalization services for select products like engraved jewelry, monogrammed bags, and custom-fit clothing. Additional charges and longer delivery times apply.'
        }
      ]
    },
    {
      category: 'Discounts & Offers',
      questions: [
        {
          question: 'How do I apply a coupon code?',
          answer: 'During checkout, enter your coupon code in the "Apply Coupon" field and click "Apply". The discount will be reflected in your order total. Note: Only one coupon can be used per order.'
        },
        {
          question: 'Do you have a loyalty program?',
          answer: 'Yes! Join our "Fusion Rewards" program - it\'s FREE. Earn 1 point per ₹100 spent. Points can be redeemed for discounts, early access to sales, and exclusive products.'
        },
        {
          question: 'Are there any student or senior citizen discounts?',
          answer: 'Yes! Students get 10% off with valid .edu email verification. Senior citizens (60+) receive 15% off on all orders. Both discounts can be combined with existing offers.'
        },
        {
          question: 'What is the "Best Price Guarantee"?',
          answer: 'If you find the same product at a lower price elsewhere within 7 days of purchase, we\'ll refund the difference. Email us the competitor\'s link with your order details to claim.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <Link to="/contact" className="inline-flex items-center gap-2 text-forest/60 hover:text-forest mb-6 transition-colors">
            <FiArrowLeft /> Back to Contact
          </Link>
          <h1 className="section-title text-forest mb-4">
            Frequently Asked <span className="italic">Questions</span>
          </h1>
          <p className="text-forest/70 text-lg">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for a question..."
            className="w-full bg-white border border-forest/20 rounded-corners-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
          />
        </div>

        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="mb-8">
            <h2 className="text-xl font-semibold text-forest mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((faq, faqIndex) => {
                const globalIndex = catIndex * 10 + faqIndex;
                const isOpen = openIndex === globalIndex;
                return (
                  <div
                    key={faqIndex}
                    className="bg-white rounded-corners-lg border border-forest/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : globalIndex)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-forest/5 transition-colors"
                    >
                      <span className="font-medium text-forest">{faq.question}</span>
                      {isOpen ? (
                        <FiChevronUp className="text-forest flex-shrink-0" />
                      ) : (
                        <FiChevronDown className="text-forest/50 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-forest/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-12 p-8 bg-olive rounded-corners-lg border border-forest/10 text-center">
          <h3 className="text-xl font-semibold text-forest mb-2">Still Have Questions?</h3>
          <p className="text-forest/60 mb-6">Our support team is here to help you with any additional queries.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all"
            >
              Contact Us
            </Link>
            <a
              href="tel:+919876543210"
              className="px-6 py-3 border-2 border-forest text-forest font-semibold rounded-corners-lg hover:bg-forest hover:text-cream transition-all"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;