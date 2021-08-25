import React from "react";
import { orderBy, reduce } from "lodash";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";

import { getLabels } from "./labels";

import {
  defaultGroupSelections,
  getGroupSelections,
  getGroupedChecks
} from "./grouping";
import { filterChecks, isHealthy, labelIndex } from "./filter";
import { CanaryTable } from "./table";
import { CanaryCards } from "./card";
import { CanarySorter, Title } from "./data";
import { CanaryDescription } from "./description";

import { StatCard } from "../StatCard";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { Toggle } from "../Toggle";

const layoutSelections = [
  {
    id: "dropdown-table",
    name: "table",
    icon: <BsTable />,
    label: "Table"
  },
  {
    id: "dropdown-card",
    name: "card",
    icon: <RiLayoutGridLine />,
    label: "Card"
  }
];

function toggleLabel(selectedLabels, label) {
  const index = labelIndex(selectedLabels, label);
  if (index >= 0) {
    return selectedLabels.filter((i) => i.id !== label.id);
  }
  selectedLabels.push(label);

  return selectedLabels;
}

export class Canary extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url;
    this.interval = 10;
    this.modal = React.createRef();
    this.fetch = this.fetch.bind(this);
    this.select = this.select.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.setGroupBy = this.setGroupBy.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.toggleLabel = this.toggleLabel.bind(this);
    this.togglePassing = this.togglePassing.bind(this);
    this.state = {
      style: layoutSelections[0],
      groupBy: defaultGroupSelections[0],
      selected: null,
      // eslint-disable-next-line react/no-unused-state
      lastFetched: null,
      hidePassing: true,
      // eslint-disable-next-line react/no-unused-state
      labels: getLabels(props.checks),
      selectedLabels: getLabels(props.checks),
      checks: props.checks ? props.checks : []
    };
  }

  componentDidMount() {
    if (this.url == null) {
      return;
    }
    this.fetch();
    this.timer = setInterval(() => this.fetch(), this.interval * 1000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  setChecks(checks) {
    if (checks.checks) {
      // FIXME unify pipeline for demo and remote
      checks = checks.checks;
    }
    this.setState({
      checks,
      // eslint-disable-next-line react/no-unused-state
      labels: getLabels(checks),
      // eslint-disable-next-line react/no-unused-state
      lastFetched: new Date()
    });
  }

  setStyle(style) {
    this.setState({
      style
    });
  }

  setGroupBy(group) {
    this.setState({
      groupBy: group
    });
  }

  toggleLabel(label) {
    this.setState((state) => ({
      selectedLabels: toggleLabel(state.selectedLabels, label)
    }));
  }

  togglePassing() {
    this.setState((state) => ({
      hidePassing: !state.hidePassing
    }));
  }

  select(check) {
    this.setState({
      selected: check
    });
    if (this.modal.current != null) {
      this.modal.current.show();
    }
  }

  fetch() {
    fetch(this.url)
      .then((result) => result.json())
      .then(this.setChecks);
  }

  render() {
    const { state } = this;
    const {
      checks: stateChecks,
      hidePassing,
      selectedLabels,
      style,
      selected,
      groupBy
    } = state;

    // first filter for pass/fail
    let checks = filterChecks(stateChecks, hidePassing, []);
    // get labels for the new subset
    const labels = getLabels(checks);
    // filter the subset down
    checks = filterChecks(checks, this.stateHidePassing, selectedLabels);
    checks = orderBy(checks, CanarySorter);
    const passed = reduce(
      checks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );
    const passedAll = reduce(
      stateChecks,
      (sum, c) => (isHealthy(c) ? sum + 1 : sum),
      0
    );

    // generate available grouping selections for dropdown menu
    const groupSelections = getGroupSelections(checks);

    // reset grouping if currently selected groupBy isn't available anymore
    if (groupSelections.findIndex((o) => o.label === groupBy.label) === -1) {
      this.setGroupBy(groupSelections[0]);
    }

    // if a grouping is selected, create a grouped version of the checks array
    let hasGrouping = false;
    let groupedChecks = [];
    if (groupBy.name !== "no-group") {
      hasGrouping = true;
      groupedChecks = getGroupedChecks(checks, groupBy);
    }

    return (
      <div className="w-full flex flex-col-reverse lg:flex-row">
        {/* middle panel */}
        <div className="w-full">
          {style.name === "card" && (
            <div className="m-6">
              <CanaryCards checks={checks} onClick={this.select} />
            </div>
          )}
          {style.name === "table" && (
            <div className="m-6 mt-0 relative">
              <div className="sticky top-0 h-6 bg-white z-10" />
              <CanaryTable
                theadClass="sticky top-6 z-10"
                checks={hasGrouping ? groupedChecks : checks}
                hasGrouping={hasGrouping}
                groupingLabel={groupBy.label}
                onClick={this.select}
              />
            </div>
          )}
        </div>

        {/* right panel */}
        <div className="bg-gray-50">
          <div className="p-6 space-y-6 sticky top-0">
            <StatCard
              title="All Checks"
              customValue={
                <>
                  {stateChecks.length}
                  <span className="text-xl font-light">
                    {" "}
                    (<span className="text-green-500">{passedAll}</span>/
                    <span className="text-red-500">
                      {stateChecks.length - passedAll}
                    </span>
                    )
                  </span>
                </>
              }
            />

            {/* second card */}
            {checks.length !== stateChecks.length && (
              <StatCard
                title="Filtered Checks"
                customValue={
                  <>
                    {checks.length}
                    <span className="text-xl  font-light">
                      {" "}
                      (<span className="text-green-500">{passed}</span>/
                      <span className="text-red-500">
                        {checks.length - passed}
                      </span>
                      )
                    </span>
                  </>
                }
              />
            )}

            {/* filtering tools */}
            <div className="h-full relative lg:w-80">
              <div className="mb-8">
                <Dropdown
                  items={layoutSelections}
                  selected={style}
                  setSelected={this.setStyle}
                  className="mb-4"
                  label="Layout"
                />

                {style.name === "table" && (
                  <Dropdown
                    items={groupSelections}
                    selected={groupBy}
                    setSelected={this.setGroupBy}
                    className="mb-4"
                    label="Group items by"
                  />
                )}
              </div>
              <Toggle
                label="Hide Passing"
                enabled={hidePassing}
                setEnabled={this.togglePassing}
                className="mb-3"
              />

              {labels.map((label) => (
                <Toggle
                  key={label.label}
                  label={label.label}
                  enabled={labelIndex(selectedLabels, label) >= 0}
                  setEnabled={() => this.toggleLabel(label)}
                  className="mb-3"
                />
              ))}
            </div>
          </div>
        </div>
        {selected != null && (
          <Modal
            ref={this.modal}
            submitText=""
            title={<Title check={selected} />}
            body={<CanaryDescription check={selected} />}
            open
          />
        )}
      </div>
    );
  }
}
