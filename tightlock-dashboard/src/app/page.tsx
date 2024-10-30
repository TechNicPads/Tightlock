"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  PlayCircle,
  Database,
  ArrowRight,
  Loader2,
} from "lucide-react";

const TightlockDashboard = () => {
  const [connections, setConnections] = useState([
    {
      label: "TEST 15 BQ to meta",
      name: "test_15_bq_to_meta",
      source: {
        type: "BIGQUERY",
        dataset: "Tightlock_test",
        table: "test_meta_table",
        unique_id: "email",
      },
      destination: {
        type: "META_MARKETING",
        ad_account_id: "1158906525188725",
        payload_type: "CREATE_USER",
        audience_name: "Marketing TL Audience from BQ 15",
      },
      schedule: "@hourly",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const [newConnection, setNewConnection] = useState({
    label: "",
    source: {
      type: "BIGQUERY",
      dataset: "",
      table: "",
      unique_id: "",
    },
    destination: {
      type: "META_MARKETING",
      access_token: "",
      ad_account_id: "",
      payload_type: "CREATE_USER",
      audience_name: "",
    },
    schedule: "@hourly",
  });

  const handleCreateConnection = async () => {
    setIsLoading(true);
    try {
      // Format the config object according to your API structure
      const config = {
        label: newConnection.label,
        value: {
          external_connections: [],
          sources: {
            [`${newConnection.label.toLowerCase().replace(/ /g, "_")}_source`]:
              {
                ...newConnection.source,
              },
          },
          destinations: {
            [`${newConnection.label.toLowerCase().replace(/ /g, "_")}_dest`]: {
              ...newConnection.destination,
            },
          },
          activations: [
            {
              name: newConnection.label.toLowerCase().replace(/ /g, "_"),
              source: {
                $ref: `#/sources/${newConnection.label
                  .toLowerCase()
                  .replace(/ /g, "_")}_source`,
              },
              destination: {
                $ref: `#/destinations/${newConnection.label
                  .toLowerCase()
                  .replace(/ /g, "_")}_dest`,
              },
              schedule: newConnection.schedule,
            },
          ],
          secrets: {},
        },
      };

      // Add API call here
      setConnections([...connections, newConnection]);
    } catch (error) {
      console.error("Error creating connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerConnection = async (connectionName, dryRun = false) => {
    setIsLoading(true);
    try {
      // Add your API call here using the trigger_connection endpoint
      console.log(
        `Triggering connection: ${connectionName}, dry run: ${dryRun}`
      );
    } catch (error) {
      console.error("Error triggering connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tightlock Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your first-party data connections
          </p>
        </header>

        <Tabs defaultValue="connections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="new">New Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            {connections.map((connection, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {connection.label}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTriggerConnection(connection.name, true)
                      }
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                      Dry Run
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        handleTriggerConnection(connection.name, false)
                      }
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                      Run
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>{connection.source.type}</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>{connection.destination.type}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Schedule: {connection.schedule}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Create New Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Connection Label</Label>
                      <Input
                        placeholder="Enter connection label"
                        value={newConnection.label}
                        onChange={(e) =>
                          setNewConnection({
                            ...newConnection,
                            label: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Source Configuration (BigQuery)</Label>
                      <div className="grid gap-4">
                        <div>
                          <Label>Dataset</Label>
                          <Input
                            placeholder="Enter dataset name"
                            value={newConnection.source.dataset}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                source: {
                                  ...newConnection.source,
                                  dataset: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Table</Label>
                          <Input
                            placeholder="Enter table name"
                            value={newConnection.source.table}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                source: {
                                  ...newConnection.source,
                                  table: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Unique ID Field</Label>
                          <Input
                            placeholder="Enter unique ID field"
                            value={newConnection.source.unique_id}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                source: {
                                  ...newConnection.source,
                                  unique_id: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Destination Configuration (Meta Marketing)</Label>
                      <div className="grid gap-4">
                        <div>
                          <Label>Access Token</Label>
                          <Input
                            type="password"
                            placeholder="Enter Meta access token"
                            value={newConnection.destination.access_token}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                destination: {
                                  ...newConnection.destination,
                                  access_token: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Ad Account ID</Label>
                          <Input
                            placeholder="Enter ad account ID"
                            value={newConnection.destination.ad_account_id}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                destination: {
                                  ...newConnection.destination,
                                  ad_account_id: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Audience Name</Label>
                          <Input
                            placeholder="Enter audience name"
                            value={newConnection.destination.audience_name}
                            onChange={(e) =>
                              setNewConnection({
                                ...newConnection,
                                destination: {
                                  ...newConnection.destination,
                                  audience_name: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Schedule</Label>
                      <Select
                        value={newConnection.schedule}
                        onValueChange={(value) =>
                          setNewConnection({
                            ...newConnection,
                            schedule: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="@hourly">Hourly</SelectItem>
                          <SelectItem value="@daily">Daily</SelectItem>
                          <SelectItem value="@weekly">Weekly</SelectItem>
                          <SelectItem value="@monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleCreateConnection}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Connection...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Connection
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TightlockDashboard;
