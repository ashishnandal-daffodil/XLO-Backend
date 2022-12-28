import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService, private readonly configService: ConfigService) {}

  public async createIndex() {
    const index = this.configService.get("ELASTICSEARCH_INDEX");
    const checkIndex = await this.esService.indices.exists({ index });
    if (!checkIndex) {
      this.esService.indices.create({
        index,
        body: {
          "settings": {
            "analysis": {
              "filter": {
                "autocomplete_filter": {
                  "type": "edge_ngram",
                  "min_gram": 1,
                  "max_gram": 8
                }
              },
              "analyzer": {
                "autocomplete": {
                  "type": "custom",
                  "tokenizer": "standard",
                  "filter": ["lowercase", "autocomplete_filter"]
                }
              }
            }
          },
          "mappings": {
            "properties": {
              "id": {
                "type": "text"
              },
              "title": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 128
                  }
                }
              },
              "category": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 64
                  }
                }
              },
              "subcategory": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 64
                  }
                }
              },
              "location": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 32
                  }
                }
              },
              "price": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard"
              }
            }
          }
        }
      });
    }
  }

  public async indexProduct(product: any) {
    return this.esService.index({
      index: this.configService.get("ELASTICSEARCH_INDEX"),
      body: product
    });
  }

  public async updateIndexedProduct(data: any) {
    return this.esService.updateByQuery({
      index: this.configService.get("ELASTICSEARCH_INDEX"),
      body: {
        "script": {
          "source":
            "ctx._source['title'] = params['title']; ctx._source['category'] = params['category']; ctx._source['subcategory'] = params['subcategory']; ctx._source['location'] = params['location']; ctx._source['price'] = params['price'];",
          "lang": "painless",
          "params": {
            title: data.changes.title,
            category: data.changes.category,
            subcategory: data.changes.subcategory,
            location: data.changes.location,
            price: data.changes.price
          }
        },
        "query": {
          "term": {
            "id": data.productId
          }
        }
      }
    });
  }

  public async deleteIndexedProduct(productId: any) {
    return this.esService.deleteByQuery({
      index: this.configService.get("ELASTICSEARCH_INDEX"),
      body: {
        "query": {
          "match": {
            "id": productId
          }
        }
      }
    });
  }

  public async searchIndexedProduct(searchString: any) {
    let res = await this.esService.search({
      index: this.configService.get("ELASTICSEARCH_INDEX"),
      body: {
        "query": {
          "multi_match": {
            "query": searchString,
            "fields": ["title", "category", "subcategory", "location", "price"]
          }
        }
      }
    });
    return res.hits.hits;
  }
}
