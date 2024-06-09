import React, { MouseEvent, useRef } from 'react';
import { csrfToken } from '~/lib/csrfToken';
import { streamCache } from '~/lib/streamCacheAdapter';

export type LogoutButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick'
>;

export const SignOutButton = (props: LogoutButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleClick = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await streamCache.clear();
    } finally {
      formRef.current!.submit();
    }
  };

  return (
    <form
      ref={formRef}
      action="/users/sign_out"
      method="POST"
      className="inline"
    >
      <input type="hidden" name="_method" value="DELETE" />
      <input type="hidden" name="authenticity_token" value={csrfToken} />
      <button {...props} type="submit" onClick={handleClick} />
    </form>
  );
};
