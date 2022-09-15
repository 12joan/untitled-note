import React from 'react'

const Editor = ({ upstreamDocument }) => {
  return (
    <div>
      <h1 className="text-3xl font-medium text-black mb-5 dark:text-white overflow-wrap-break-word">
        {upstreamDocument.title}
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      </h1>

      <div className="prose prose-slate dark:prose-invert text-black dark:text-white">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Address:<br />1234 Main Street<br />Anytown, USA</p>
        <p><strong>Bold</strong> <em>Italic</em> <del>Strikethrough</del></p>
        <p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a></p>
        <blockquote>
          <p>Blockquote</p>
        </blockquote>
        <pre>Code</pre>
        <pre>Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</pre>
        <p>Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
        <ul>
          <li>Unordered list</li>
          <li>Unordered list</li>
          <li>Unordered list</li>
        </ul>
        <ol>
          <li>Ordered list</li>
          <li>Ordered list</li>
          <li>Ordered list</li>
        </ol>
        <ul>
          <li>Unordered list</li>
          <li>Unordered list
            <ul>
              <li>Unordered list</li>
              <li>Unordered list</li>
              <li>Unordered list</li>
            </ul>
          </li>
          <li>Unordered list</li>
        </ul>
        <ol>
          <li>Ordered list</li>
          <li>Ordered list
            <ol>
              <li>Ordered list</li>
              <li>Ordered list</li>
              <li>Ordered list</li>
            </ol>
          </li>
          <li>Ordered list</li>
        </ol>
        <ul>
          <li>The quick brown fox jumps over level 1
            <ul>
              <li>The quick brown fox jumps over level 2
                <ul>
                  <li>The quick brown fox jumps over level 3
                    <ul>
                      <li>The quick brown fox jumps over level 4
                        <ul>
                          <li>The quick brown fox jumps over level 5
                            <ul>
                              <li>The quick brown fox jumps over level 6
                                <ul>
                                  <li>The quick brown fox jumps over level 7
                                    <ul>
                                      <li>The quick brown fox jumps over level 8
                                        <ul>
                                          <li>The quick brown fox jumps over level 9
                                            <ul>
                                              <li>The quick brown fox jumps over level 10
                                                <ul>
                                                  <li>The quick brown fox jumps over level 11
                                                    <ul>
                                                      <li>The quick brown fox jumps over level 12
                                                        <ul>
                                                          <li>The quick brown fox jumps over level 13
                                                            <ul>
                                                              <li>The quick brown fox jumps over level 14
                                                                <ul>
                                                                  <li>The quick brown fox jumps over level 15
                                                                    <ul>
                                                                      <li>The quick brown fox jumps over level 16</li>
                                                                    </ul>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            </ul>
                                                          </li>
                                                        </ul>
                                                      </li>
                                                    </ul>
                                                  </li>
                                                </ul>
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Editor
