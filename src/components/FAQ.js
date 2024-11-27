import React from 'react';

function FAQ() {
  return (
    <div className="faq">
      <h2>Frequently Asked Questions</h2>
      <dl>
        <dt>How do I start my Minecraft server?</dt>
        <dd>Log in to your account and click the "Start Server" button on the dashboard.</dd>
        
        <dt>What version of Minecraft does the server run?</dt>
        <dd>Our servers run the latest stable version of Minecraft Java Edition.</dd>
        
        <dt>How many players can join my server?</dt>
        <dd>The default player limit is 20, but this can be adjusted in the server settings.</dd>
        
        <dt>How do I access my server's files?</dt>
        <dd>We provide FTP access to your server files. You can find the FTP credentials in your account settings.</dd>
        
        <dt>What if I need help with my server?</dt>
        <dd>Our support team is available 24/7. You can reach us through the support ticket system in your account dashboard.</dd>
      </dl>
    </div>
  );
}

export default FAQ;

