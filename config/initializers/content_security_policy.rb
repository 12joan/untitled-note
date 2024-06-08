# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.connect_src '*'
    policy.font_src    :self
    policy.img_src     '*'
    policy.object_src  :none
    policy.script_src  :self
    policy.style_src   :self

    # @vite/client
    if Rails.env.development?
      # policy.connect_src *policy.connect_src, '*'
      policy.script_src *policy.script_src, :unsafe_eval, :unsafe_inline
      policy.style_src *policy.style_src, :unsafe_inline
    end

    # Specify URI for violation reports
    # policy.report_uri "/csp-violation-report-endpoint"
  end

  unless Rails.env.development?
    # Generate session nonces for permitted importmap and inline scripts
    config.content_security_policy_nonce_generator = ->(request) { SecureRandom.base64(16) }
    config.content_security_policy_nonce_directives = %w(style-src)
  end

  # Report violations without enforcing the policy.
  # config.content_security_policy_report_only = true
end
