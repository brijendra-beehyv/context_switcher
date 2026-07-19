import React, { useEffect, useState } from "react";
import { Text, Box, useInput, useApp } from "ink";
import { getAllContexts, getCurrentContext, useContext } from "./kubectl.js";
import { CLEAR_SCREEN } from "./utils.js";


function App() {
  const [currentContext, setCurrentContext] = useState<string>();
  const [allContexts, setAllContexts] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const { exit } = useApp();

  const filteredContexts = allContexts.filter((ctx) =>
    query.split(" ").every((q) => ctx.includes(q.trim())),
  );

  async function initialize() {
    const allContexts = await getAllContexts();
    setAllContexts(allContexts);
    setQuery("");

    if (allContexts.length > 0) {
      const currentContext = await getCurrentContext();
      const selectedIndex = allContexts.indexOf(currentContext);

      setSelectedIndex(selectedIndex);
      setCurrentContext(currentContext);
    }
  }

  useInput(async (input, key) => {
    if (key.escape) {
      exit(0);
    }

    if (allContexts.length <= 0) {
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) =>
        Math.min(filteredContexts.length - 1, prev + 1),
      );
    } else if (key.return) {
      await useContext(filteredContexts[selectedIndex] as string);
      await initialize();
    } else if (key.backspace) {
      setQuery((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
    } else if (input.length > 0) {
      setQuery((prev) => prev + input);
      setSelectedIndex(0);
    }
  });

  useEffect(() => {
    process.stdout.write(CLEAR_SCREEN);
    initialize();
  }, []);

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column">
        <Text bold>Select K8s Context (Enter to switch, Esc to quit):</Text>
        <Text>
          Search:{" "}
          {query ? (
            <Text>'{query}'</Text>
          ) : (
            <Text dimColor>Type to search...</Text>
          )}
        </Text>
      </Box>

      <Box flexDirection="column">
        {filteredContexts.length > 0 ? (
          filteredContexts.map((context, i) => (
            <Text key={context} inverse={selectedIndex === i}>
              {currentContext === context ? " * " : "   "}
              {context}
            </Text>
          ))
        ) : (
          <Text>No contexts found.</Text>
        )}
      </Box>
    </Box>
  );
}

export default App;
