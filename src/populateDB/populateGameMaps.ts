import type { Request, Response, NextFunction } from "express";
import MapLayout from "../dataModel/mapLayout.model";
import fs from "fs";
import path from "path";
import crypto from "crypto";

async function loadMapData(directoryName: string) {
  const allMapsFileNames = fs.readdirSync(path.join(__dirname, directoryName), {encoding: "utf-8", withFileTypes: true});
  const jsonFiles = allMapsFileNames.filter((file) => file.name.endsWith(".json"));
  const sha256Files = allMapsFileNames.filter((file) => file.name.endsWith(".sha256"));

  const updatedJsonFilesData = sha256Files.map((file) => {
    const sha256FilePath = path.join(__dirname, directoryName, file.name);
    const rawSha256Data = fs.readFileSync(sha256FilePath, "utf-8");
    const parsedSha256Data = JSON.parse(rawSha256Data);
    const oldFileData = JSON.parse(fs.readFileSync(parsedSha256Data.belongsTo, "utf-8")); //parsedSha256Data.belongsTo;
    const newSha256File = createHashAndSaveOnDisk(oldFileData, directoryName, file.name, false);
    if (isDiffData(parsedSha256Data.Hash, newSha256File.Hash)) {
      deleteHashFile(sha256FilePath);
      createHashAndSaveOnDisk(oldFileData, directoryName, file.name, true, JSON.stringify(newSha256File));
      console.log(`🔁 Updated hash for ${parsedSha256Data.belongsTo}`)
      return oldFileData
    }
    return null
  }).filter(Boolean)
  const newJsonFiles = jsonFiles.map((file) => {
    const base = file.name.split(".")[0];
    const isHashed = sha256Files.find(sha => sha.name.startsWith(base));
    if(!isHashed){
      const filePath = path.join(__dirname, directoryName, file.name);
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const newSha256File = createHashAndSaveOnDisk(fileData, directoryName, file.name, true);
      createHashAndSaveOnDisk(fileData, directoryName, file.name, true, JSON.stringify(newSha256File));
      console.log(`🆕 Created hash for new file: ${file.name}`)
      return fileData
    }
    return null
  }).filter(Boolean);
  return [...updatedJsonFilesData, ...newJsonFiles];
}

function createHashAndSaveOnDisk(file: any,directoryName: string, fileName: string, isSave: boolean, sha256Files?: string) {
  const filePath = path.join(__dirname, directoryName, `${fileName.split(".")[0]}.sha256`);
  if(sha256Files && isSave){
    fs.writeFileSync(filePath, sha256Files);
  }
  const hash = crypto.createHash("sha256").update(JSON.stringify(file)).digest("hex");
  const result = {Hash: hash, belongsTo: filePath.replace(".sha256", ".json")};
  if (isSave) {
    fs.writeFileSync(filePath, JSON.stringify(result));
  }
  return {Hash: hash, FilePath: filePath};
}

function deleteHashFile(filePath: string) {
  fs.unlinkSync(filePath);
}

function isDiffData(oldHash: string, newHash: string): boolean {
  return oldHash !== newHash

}


export async function populateGameMaps() {
  try{
    const mapData = await loadMapData("mapLayout");
    console.log(mapData);
  }catch(err){
    console.log(err);
  }
}

populateGameMaps();

