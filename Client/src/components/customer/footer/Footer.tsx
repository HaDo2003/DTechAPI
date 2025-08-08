import React, { useState } from 'react';
import DTechLogo from '../../../assets/DTechlogo.png';
import FooterItem from './FooterItem';
import ConnectItem from './ConnectItem';
import PaymentItem from './PaymentItem';
import Paypal from '../../../assets/paypal.png';
import VNPay from '../../../assets/vnpay.png';


interface FooterProps {
  onNavigate?: (path: string) => void;
  onNewsletterSubcribe?: (email: string) => void;
}

const Footer: React.FC<FooterProps> = ({
  onNavigate = () => { },
  onNewsletterSubcribe = () => {}
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onNewsletterSubcribe(email.trim());
    }
  };

  return (
    <>
      <div id="newsletter" className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            <div className="col-md-12">
              <div className="newsletter">
                <p>Sign Up for the <strong>NEWSLETTER</strong></p>
                <form onSubmit={handleSubmit}>
                  <input 
                    className="input" 
                    type="email" 
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="newsletter-btn" type="submit">
                    <i className="fa fa-envelope"></i> Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* /NEWSLETTER */}

      <div className="footer-top bg-footer py-4 text-light">
        <div className="container">
          <div className="row gy-4">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6">
              <img src={DTechLogo} alt="DTech Logo" className="mb-3 w-50" />
              <p>
                DTech system specializes in selling laptops, tablet,
                smart homes, and genuine accessories — good prices and free delivery.
              </p>
              <ul className="list-unstyled small mt-3">
                <li><strong>Address:</strong> Thu Duc, Ho Chi Minh City</li>
                <li><strong>Phone:</strong> 1900 1234</li>
                <li><strong>Email:</strong> dtech@gmail.com</li>
              </ul>
            </div>

            {/* Policies */}
            <div className="col-lg-2 col-md-6">
              <h5 className="text-uppercase fw-bold mb-3">Policies</h5>
              <ul className="list-unstyled">
                <FooterItem label='Purchase Policy' onClick={() => onNavigate('/purchase-policy')} />
                <FooterItem label='Return Policy' onClick={() => onNavigate('/return-policy')} />
                <FooterItem label='Shipping Policy' onClick={() => onNavigate('/shipping-policy')} />
                <FooterItem label='Privacy Policy' onClick={() => onNavigate('/privacy-policy')} />
                <FooterItem label='Warranty Policy' onClick={() => onNavigate('/warranty-policy')} />
                <FooterItem label='Store Terms' onClick={() => onNavigate('/store-terms')} />
              </ul>
            </div>

            {/* Guides */}
            <div className="col-lg-2 col-md-6">
              <h5 className="text-uppercase fw-bold mb-3">Guides</h5>
              <ul className="list-unstyled">
                <FooterItem label='Shopping Guide' onClick={() => onNavigate('/shopping-guide')} />
                <FooterItem label='Return Guide' onClick={() => onNavigate('/return-guide')} />
                <FooterItem label='Account Transfer' onClick={() => onNavigate('/account-transfer')} />
                <FooterItem label='Installment Guide' onClick={() => onNavigate('/installment-guide')} />
                <FooterItem label='Refund Guide' onClick={() => onNavigate('/refund-guide')} />
              </ul>
            </div>

            {/* Connect & Payment */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <h5 className="text-uppercase fw-bold mb-3">Connect With Us</h5>
                <div className="d-flex gap-3">
                  <ConnectItem title="Facebook" falink="facebook-f" className="fb-bg" />
                  <ConnectItem title="Instagram" falink="instagram" className="ig-bg" />
                  <ConnectItem title="YouTube" falink="youtube" className="ytb-bg" />
                  <ConnectItem title="Twitter" falink="twitter" className="tw-bg" />
                </div>
              </div>

              <div>
                <h5 className="text-uppercase fw-bold mb-3">Payment Support</h5>
                <div className="d-flex flex-wrap gap-3">
                  <PaymentItem src={Paypal} alt="PayPal" />
                  <PaymentItem src={VNPay} alt="VNPay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom clearfix">
        <div className="container">
          <div className="row-cols-auto text-center">© Copyright belongs to DTeam</div>
        </div>
      </div>
    </>
  );
};

export default Footer;